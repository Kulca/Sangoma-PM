export type MarketStatus = 'open' | 'closed' | 'resolved';

export interface Market {
  id: string;
  title: string;
  description: string;
  category: 'Energy' | 'Politics' | 'Economics' | 'Water' | 'Logistics';
  status: MarketStatus;
  endDate: string;
  outcomes: {
    id: string;
    label: string;
    probability: number; // 0 to 1
  }[];
  volume: number; // ZAR equivalent or 'play money'
}
