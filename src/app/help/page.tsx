'use client';

import { BookOpen, HelpCircle, Shield, TrendingUp, Zap, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const sections = [
    {
      title: 'Getting Started',
      icon: <Zap className="text-sangoma-gold" />,
      items: [
        { q: 'What is Sangoma?', a: 'Sangoma is a prediction market platform designed for the South African context. It allows you to trade on the outcome of real-world events like loadshedding stages, elections, and economic indicators.' },
        { q: 'How do I start trading?', a: 'Once you deposit ZAR, you can buy shares in specific outcomes. If your prediction is correct, your shares settle at R1.00 each. If not, they settle at R0.00.' },
      ]
    },
    {
      title: 'Governance & Trust',
      icon: <Shield className="text-sangoma-gold" />,
      items: [
        { q: 'How are markets resolved?', a: 'We use automated oracles (like the EskomSePush API) to resolve markets instantly. For complex events, the Sangoma Council provides a final, verified resolution.' },
        { q: 'What if I disagree with a result?', a: 'Every market has a 24-hour dispute window. If you provide verifiable evidence, the Sangoma Council will review the case and can overturn a resolution.' },
      ]
    },
    {
      title: 'Trading Mechanics',
      icon: <TrendingUp className="text-sangoma-gold" />,
      items: [
        { q: 'What are Brier Scores?', a: 'A Brier score measures the accuracy of probabilistic forecasts. We use it to rank our top predictors and ensure market integrity.' },
        { q: 'What is a CLOB?', a: 'CLOB stands for Central Limit Order Book. It is a transparent system that matches buyers and sellers in real-time based on price and time priority.' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-24">
      {/* Hero */}
      <div className="bg-sangoma-green text-white pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 text-sangoma-gold font-black uppercase tracking-widest text-xs mb-4">
            <BookOpen size={16} /> Sangoma Academy
          </div>
          <h1 className="text-5xl font-black mb-6 italic tracking-tighter">Knowledge is Power.</h1>
          <div className="relative max-w-xl">
            <input 
              type="text" 
              placeholder="Search for topics, guides, or rules..."
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 px-6 text-white placeholder-white/40 font-bold outline-none focus:bg-white/20 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-sangoma-green/10 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-sangoma-gold/20 p-3 rounded-2xl">
                <HelpCircle className="text-sangoma-gold" />
              </div>
              <div>
                <h3 className="font-black text-sangoma-green">Beginner's Guide</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Learn the basics in 2 mins</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
          </div>
          <div className="bg-white p-6 rounded-3xl border border-sangoma-green/10 shadow-sm flex items-center justify-between group cursor-pointer hover:shadow-md transition-all">
            <div className="flex items-center gap-4">
              <div className="bg-sangoma-gold/20 p-3 rounded-2xl">
                <Shield className="text-sangoma-gold" />
              </div>
              <div>
                <h3 className="font-black text-sangoma-green">Rules & Safety</h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Compliance and verification</p>
              </div>
            </div>
            <ChevronRight className="text-gray-300 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-6 px-2">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                  {section.icon}
                </div>
                <h2 className="text-xl font-black text-sangoma-green italic">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <details key={i} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all hover:border-sangoma-gold/30">
                    <summary className="flex justify-between items-center p-5 cursor-pointer list-none">
                      <h4 className="text-sm font-black text-sangoma-green pr-8 leading-tight">{item.q}</h4>
                      <ChevronRight size={18} className="text-gray-300 group-open:rotate-90 transition-transform flex-shrink-0" />
                    </summary>
                    <div className="px-5 pb-5 pt-0 border-t border-gray-50 mt-1">
                      <p className="text-xs text-gray-500 font-medium leading-relaxed pt-4">
                        {item.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-16 bg-sangoma-gold rounded-[2.5rem] p-10 text-sangoma-green relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-2xl font-black mb-2 tracking-tight italic">Still have questions?</h3>
            <p className="text-sm font-black opacity-60 mb-6 uppercase tracking-widest">Our support team is online</p>
            <button className="bg-sangoma-green text-white font-black py-4 px-8 rounded-2xl hover:scale-105 transition-all">
              Chat with a Sangoma
            </button>
          </div>
          <HelpCircle size={160} className="absolute -bottom-10 -right-10 text-sangoma-green/5 rotate-12" />
        </div>
      </div>
    </div>
  );
}
