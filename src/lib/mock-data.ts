import { Market } from './types';

export const mockMarkets: Market[] = [
  {
    id: '1',
    title: 'National Loadshedding Stage by Friday Night',
    description: 'What will be the national loadshedding stage at 22:00 SAST on Friday, May 10th?',
    category: 'Energy',
    status: 'open',
    endDate: '2024-05-10T20:00:00Z',
    outcomes: [
      { id: 'stage-0', label: 'Stage 0', probability: 0.1 },
      { id: 'stage-2', label: 'Stage 2', probability: 0.4 },
      { id: 'stage-4', label: 'Stage 4', probability: 0.35 },
      { id: 'stage-6', label: 'Stage 6+', probability: 0.15 },
    ],
    volume: 12500,
  },
  {
    id: '2',
    title: '2024 Election: Will there be a National Grand Coalition?',
    description: 'Will the ANC and DA form a national-level coalition government after the 2024 elections?',
    category: 'Politics',
    status: 'open',
    endDate: '2024-06-02T12:00:00Z',
    outcomes: [
      { id: 'yes', label: 'Yes', probability: 0.25 },
      { id: 'no', label: 'No', probability: 0.75 },
    ],
    volume: 45000,
  },
  {
    id: '3',
    title: 'ZAR/USD Exchange Rate at End of Month',
    description: 'Will the ZAR/USD exchange rate be above R19.00 on May 31st?',
    category: 'Economics',
    status: 'open',
    endDate: '2024-05-31T15:00:00Z',
    outcomes: [
      { id: 'above', label: 'Above R19.00', probability: 0.62 },
      { id: 'below', label: 'Below R19.00', probability: 0.38 },
    ],
    volume: 8200,
  },
];
