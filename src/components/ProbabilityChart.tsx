'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { time: '08:00', prob: 45 },
  { time: '10:00', prob: 48 },
  { time: '12:00', prob: 42 },
  { time: '14:00', prob: 55 },
  { time: '16:00', prob: 52 },
  { time: '18:00', prob: 58 },
  { time: '20:00', prob: 60 },
  { time: '22:00', prob: 62 },
];

export default function ProbabilityChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="time" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#9ca3af' }}
            dy={10}
          />
          <YAxis 
            hide 
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="prob" 
            stroke="#d4af37" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorProb)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
