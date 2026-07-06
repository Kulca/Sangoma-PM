'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, Send, CheckCircle, Info } from 'lucide-react';

export default function ProposalsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [proposals, setProposals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Energy',
    description: '',
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    try {
      setError(null);
      const res = await fetch('/api/proposals');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProposals(data);
      } else if (data?.error) {
        console.error('API error:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setFormData({ title: '', category: 'Energy', description: '' });
        fetchProposals();
      } else {
        setError(data?.error || 'Failed to submit proposal. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit proposal:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-sangoma-green text-white pb-24">
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="bg-sangoma-gold/20 p-4 rounded-3xl w-fit mx-auto mb-6 shadow-2xl">
            <Lightbulb size={40} className="text-sangoma-gold" />
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-4">Shape the Future</h1>
          <p className="text-white/60 text-sm font-medium">
            Sangoma is built by the community. Suggest a new prediction market category 
            or a specific event you want to trade on.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          
          {/* Form */}
          <div className="bg-white rounded-[2.5rem] p-8 text-sangoma-green shadow-2xl">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                  <CheckCircle size={40} />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tight">Proposal Received!</h2>
                <p className="text-gray-400 text-sm font-medium mb-8">
                  The Sangoma Council will review your idea. You'll be notified if it's approved for listing.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="bg-sangoma-green text-white font-black py-4 px-8 rounded-2xl hover:scale-105 transition-all"
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border-2 border-red-200 text-red-600 text-xs font-bold py-3 px-4 rounded-2xl">
                    {error}
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Market Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Next fuel price adjustment..."
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Category</label>
                  <select 
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all appearance-none"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                  >
                    <option>Energy</option>
                    <option>Politics</option>
                    <option>Economics</option>
                    <option>Water</option>
                    <option>Logistics</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1 ml-2">Description & Resolution Source</label>
                  <textarea 
                    required
                    placeholder="Explain the event and where we can verify the outcome..."
                    className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-4 font-bold outline-none focus:border-sangoma-gold/30 transition-all h-32"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-sangoma-gold text-sangoma-green font-black py-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    <><Send size={18} /> Send to Council</>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Guidelines & Recent */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
              <h3 className="text-sangoma-gold font-black uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                <Info size={14} /> Submission Guidelines
              </h3>
              <ul className="text-xs space-y-3 font-medium text-white/80">
                <li className="flex gap-2">
                  <span className="text-sangoma-gold font-black">•</span>
                  Must be verifiable via a public, official API or primary government source.
                </li>
                <li className="flex gap-2">
                  <span className="text-sangoma-gold font-black">•</span>
                  Must have a clear, binary or discrete outcome (No open-ended questions).
                </li>
                <li className="flex gap-2">
                  <span className="text-sangoma-gold font-black">•</span>
                  Must occur within the next 12 months.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white/40 font-black uppercase tracking-widest text-[10px] mb-2 px-2">Recent Community Ideas</h3>
              {loading ? (
                <div className="p-4 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">Loading...</div>
              ) : proposals.length === 0 ? (
                <div className="p-4 text-center text-white/20 text-[10px] font-black uppercase tracking-widest">No proposals yet</div>
              ) : (
                proposals.map((proposal: any) => (
                  <div key={proposal.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-black text-sm">{proposal.title}</h4>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                        proposal.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/40'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-white/50 font-medium">{proposal.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[8px] text-sangoma-gold font-bold uppercase">{proposal.category}</span>
                      <span className="text-[8px] text-white/20">{new Date(proposal.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
