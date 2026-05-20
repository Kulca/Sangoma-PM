import { SafeAuthPack, SafeAuthInitOptions } from '@safe-global/auth-kit';

export const getSafeAuthPack = async () => {
  const safeAuthPack = new SafeAuthPack();
  
  const options: SafeAuthInitOptions = {
    showRPCGift: true,
    chainConfig: {
      blockExplorerUrl: 'https://amoy.polygonscan.com',
      chainId: '0x13882',
      displayName: 'Polygon Amoy Testnet',
      rpcTarget: 'https://rpc-amoy.polygon.technology',
      ticker: 'POL',
      tickerName: 'Polygon ecosystem token',
    },
  };

  await safeAuthPack.init(options);
  return safeAuthPack;
};
