
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  TrendingUp, 
  Calendar,
  History,
  LayoutDashboard,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Trade, Pair, Session, Result, Rating } from './types';
import TradeForm from './components/TradeForm';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<'dashboard' | 'history' | 'new-trade'>('dashboard');
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filters, setFilters] = useState({
    pair: 'All' as Pair | 'All',
    session: 'All' as Session | 'All',
    result: 'All' as Result | 'All',
    rating: 'All' as Rating | 'All',
  });

  useEffect(() => {
    const saved = localStorage.getItem('chronos_trades');
    if (saved) {
      try {
        setTrades(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse trades", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chronos_trades', JSON.stringify(trades));
  }, [trades]);

  const filteredTrades = useMemo(() => {
    return trades.filter((t) => {
      if (filters.pair !== 'All' && t.pair !== filters.pair) return false;
      if (filters.session !== 'All' && t.session !== filters.session) return false;
      if (filters.result !== 'All' && t.result !== filters.result) return false;
      if (filters.rating !== 'All' && t.rating !== filters.rating) return false;
      return true;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [trades, filters]);

  const saveTrade = (newTrade: Trade) => {
    setTrades([ ...trades, { ...newTrade, createdAt: Date.now() } ]);
    setView('history');
  };

  const deleteTrade = (id: string) => {
    if (confirm('Delete this trade record?')) {
      setTrades(trades.filter(t => t.id !== id));
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-zinc-100 rounded-sm flex items-center justify-center">
              <TrendingUp className="text-zinc-950" size={18} />
            </div>
            <h1 className="text-lg font-black tracking-tighter uppercase italic">Chronos</h1>
          </div>
          <nav className="space-y-1">
            <NavItem active={view === 'dashboard'} icon={<LayoutDashboard size={18} />} label="Analytics" onClick={() => setView('dashboard')} />
            <NavItem active={view === 'history'} icon={<History size={18} />} label="Journal" onClick={() => setView('history')} />
            <NavItem active={view === 'new-trade'} icon={<Plus size={18} />} label="Log Entry" onClick={() => setView('new-trade')} />
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-zinc-900">
          <div className="bg-zinc-900/50 p-4 rounded-lg text-center">
            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest">Process Focused</p>
            <p className="text-xs font-medium text-zinc-300 uppercase tracking-tighter">Systematic Execution</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-zinc-950">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {view === 'new-trade' ? (
            <TradeForm onSave={saveTrade} onCancel={() => setView('dashboard')} />
          ) : view === 'dashboard' ? (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Performance Hub</h2>
                  <p className="text-sm text-zinc-500">Aggregated statistics from your trade records.</p>
                </div>
                <button onClick={() => setView('new-trade')} className="bg-zinc-100 text-zinc-950 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-tight flex items-center gap-2 hover:bg-zinc-300 transition-colors">
                  <Plus size={16} /> New Entry
                </button>
              </div>
              <Dashboard trades={trades} />
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Journal Archive</h2>
                  <p className="text-sm text-zinc-500">History of executions and process notes.</p>
                </div>
                <div className="flex gap-2">
                   <select className="bg-zinc-900 border border-zinc-800 text-xs p-2 rounded focus:outline-none" value={filters.pair} onChange={(e) => setFilters({...filters, pair: e.target.value as any})}>
                    <option value="All">All Pairs</option>
                    {['NQ', 'ES', 'EURUSD'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                {filteredTrades.length === 0 ? (
                  <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-lg">
                    <p className="text-zinc-500 text-sm italic tracking-tight">No trade data available for this selection.</p>
                  </div>
                ) : (
                  filteredTrades.map((trade) => (
                    <TradeEntryCard key={trade.id} trade={trade} onDelete={deleteTrade} />
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; icon: React.ReactNode; label: string; onClick: () => void }> = ({ active, icon, label, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 ${active ? 'bg-zinc-100 text-zinc-950 font-bold' : 'text-zinc-500 hover:text-zinc-100 hover:bg-zinc-900'}`}>
    {icon}
    <span className="text-sm uppercase tracking-tight">{label}</span>
  </button>
);

const TradeEntryCard: React.FC<{ trade: Trade; onDelete: (id: string) => void }> = ({ trade, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // Aggregate confluences (excluding 'rb' as it's merged back into 'other')
  const allConfluences = [
    ...(trade.poi.fvg || []), 
    ...(trade.poi.ob || []), 
    ...(trade.poi.other || []), 
    ...(trade.smtTypes || [])
  ];

  return (
    <div className={`bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden transition-all duration-300 group ${expanded ? 'ring-1 ring-zinc-700 shadow-2xl' : 'hover:border-zinc-700 shadow-sm'}`}>
      <div className="p-5 flex items-center justify-between cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-6">
          <div className={`w-12 h-12 rounded flex items-center justify-center font-black text-lg transition-transform group-hover:scale-105 ${trade.result.includes('Win') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
            {trade.pair.substring(0, 2)}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-100">{trade.pair}</span>
              <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-black uppercase tracking-widest">{trade.session}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-widest ${trade.rating === 'A' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-zinc-800 text-zinc-500'}`}>Grade {trade.rating}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
              <span className="flex items-center gap-1.5"><Calendar size={12} className="text-zinc-600" /> {trade.date}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-right">
            <div className={`text-xl font-black tracking-tighter transition-all ${trade.result.includes('Win') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {trade.result.includes('Win') ? '+' : '-'}{trade.rr}R
            </div>
            <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">{trade.result}</div>
          </div>
          <ChevronRight size={20} className={`text-zinc-600 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-8 space-y-8 border-t border-zinc-800 pt-6 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest border-l-2 border-indigo-500 pl-2">System Confluences</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  {allConfluences.length > 0 ? allConfluences.map((p, i) => (
                    <span key={i} className="text-[10px] bg-zinc-950 text-zinc-400 px-2 py-1 rounded border border-zinc-800 font-bold uppercase tracking-tight">{p}</span>
                  )) : <span className="text-xs text-zinc-600 italic">No specific confluences logged.</span>}
                </div>
              </div>
              <div>
                <h4 className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest border-l-2 border-indigo-500 pl-2">System Narrative</h4>
                <div className="space-y-4 bg-zinc-950/50 p-4 rounded border border-zinc-800/50 text-sm">
                  <div>
                    <span className="text-zinc-600 font-bold text-[10px] block uppercase tracking-widest mb-1">Draw on Liquidity</span>
                    <p className="text-zinc-300 leading-relaxed italic">{trade.review.recap.drawOnLiquidity || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-zinc-600 font-bold text-[10px] block uppercase tracking-widest mb-1">HTF Narrative</span>
                    <p className="text-zinc-300 leading-relaxed italic">{trade.review.recap.htfNarrative || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
               <div>
                <h4 className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest border-l-2 border-amber-500 pl-2">Key Lesson</h4>
                <p className="text-sm font-bold italic text-zinc-200 bg-zinc-800/50 p-4 rounded border border-zinc-700/30">"{trade.review.keyLesson || 'Keep consistent with the rules.'}"</p>
              </div>
              <div className="grid grid-cols-1 gap-5">
                {trade.review.mistakes.length > 0 && (
                  <div>
                    <h5 className="text-[10px] text-rose-500 uppercase font-bold mb-2 tracking-widest">❌ Mistakes / Risks</h5>
                    <ul className="text-xs text-zinc-400 space-y-1.5">
                      {trade.review.mistakes.map((m, i) => <li key={i} className="flex gap-2"><span className="text-zinc-600">•</span> {m}</li>)}
                    </ul>
                  </div>
                )}
                {trade.review.whatWentWell.length > 0 && (
                  <div>
                    <h5 className="text-[10px] text-emerald-500 uppercase font-bold mb-2 tracking-widest">✅ Successes / Strengths</h5>
                    <ul className="text-xs text-zinc-400 space-y-1.5">
                      {trade.review.whatWentWell.map((w, i) => <li key={i} className="flex gap-2"><span className="text-zinc-600">•</span> {w}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          {trade.images.length > 0 && (
            <div className="space-y-2">
               <h4 className="text-[10px] text-zinc-500 font-bold uppercase mb-2 tracking-widest">Chart Context</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trade.images.map((img, idx) => (
                  <div key={idx} className="aspect-video relative rounded-md overflow-hidden border border-zinc-800 bg-zinc-950 group/img">
                    <img src={img} className="object-contain w-full h-full transition-transform duration-500 group-hover/img:scale-110" alt="chart" />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
            <div className="text-[10px] text-zinc-600 font-mono">ID: {trade.id.substring(0,8)}...</div>
            <button onClick={(e) => { e.stopPropagation(); onDelete(trade.id); }} className="text-[10px] font-black text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-widest">Remove Record</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
