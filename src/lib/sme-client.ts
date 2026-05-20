import { signOrder, getOrCreateSessionKey, Order as SafeOrder } from './safe-service';
import { ethers } from 'ethers';

export type MessageType = 'place_order' | 'get_book' | 'book_update' | 'order_response';

export interface SMEOrder {
  id: string;
  user_id: string;
  market_id: string;
  outcome_token_id: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price: number;
  quantity: number;
  remaining_quantity: number;
  created_at: string;
  salt?: string;
  expiration?: number;
  signature?: string;
}

export interface SMETrade {
  id: string;
  market_id: string;
  outcome_token_id: string;
  buy_order_id: string;
  sell_order_id: string;
  price: number;
  quantity: number;
  executed_at: string;
}

class SMEClient {
  private ws: WebSocket | null = null;
  private listeners: Set<(msg: any) => void> = new Set();
  private queue: any[] = [];
  private url: string;

  constructor(url: string = process.env.NEXT_PUBLIC_SME_URL || 'ws://localhost:8080') {
    this.url = url;
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
          console.log('Connected to SME');
          this.flushQueue();
          resolve(true);
        };
        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.listeners.forEach(l => l(data));
        };
        this.ws.onclose = () => {
          console.log('Disconnected from SME');
        };
        this.ws.onerror = (error) => {
          console.error('SME WebSocket error:', error);
          reject(error);
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  private flushQueue() {
    while (this.queue.length > 0 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      const msg = this.queue.shift();
      this.ws.send(JSON.stringify(msg));
    }
  }

  subscribe(listener: (msg: any) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  send(msg: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.log('Queueing message:', msg.type);
      this.queue.push(msg);
      if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
        this.connect();
      }
    }
  }

  getBook(marketId: string, outcomeTokenId: string) {
    this.send({
      type: 'get_book',
      market_id: marketId,
      outcome_token_id: outcomeTokenId
    });
  }

  async placeOrder(order: Partial<SMEOrder>, signer?: ethers.Signer) {
    const effectiveSigner = signer || getOrCreateSessionKey();
    const makerAddress = effectiveSigner ? await effectiveSigner.getAddress() : '0xCurrentUserAddress';
    const salt = `0x${Math.floor(Math.random() * 1000000000).toString(16).padStart(64, '0')}`;
    const expiration = Math.floor(Date.now() / 1000) + 3600;

    const fullOrder: SMEOrder = {
      id: `ord-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      user_id: makerAddress,
      created_at: new Date().toISOString(),
      remaining_quantity: order.quantity || 0,
      salt,
      expiration,
      signature: '0xMockSignature',
      market_id: order.market_id || '',
      outcome_token_id: order.outcome_token_id || '',
      side: order.side || 'buy',
      type: order.type || 'limit',
      price: order.price || 0,
      quantity: order.quantity || 0,
      ...order
    };

    if (effectiveSigner) {
      try {
        const safeOrder: SafeOrder = {
          maker: makerAddress,
          token: fullOrder.outcome_token_id,
          price: ethers.parseUnits(fullOrder.price.toString(), 18).toString(),
          amount: ethers.parseUnits(fullOrder.quantity.toString(), 18).toString(),
          side: fullOrder.side === 'buy' ? 0 : 1,
          salt: fullOrder.salt!,
          expiration: fullOrder.expiration!,
        };
        fullOrder.signature = await signOrder(effectiveSigner, safeOrder);
        console.log('Order signed:', fullOrder.signature);
      } catch (err) {
        console.error('Failed to sign order:', err);
      }
    }

    this.send({
      type: 'place_order',
      order: fullOrder
    });

    return fullOrder.id;
  }
}

export const smeClient = typeof window !== 'undefined' ? new SMEClient() : null;
