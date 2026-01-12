
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Trade, DashboardStats, Session, EntryType, Rating, RiskLevel } from '../types';
import { SESSIONS, ENTRY_TYPES, RATINGS, RISK_LEVELS } from '../constants';

interface DashboardProps {
  trades: Trade[];
}

const Dashboard: React.FC<DashboardProps> = ({ trades }) => {
  const stats: DashboardStats = React.useMemo(() => {
    const total = trades.length;
    const wins = trades.filter(t => t.result === 'Win' || t.result === 'Small Win').length;
    const losses = trades.filter(t => t.result === 'Loss' || t.result === 'Small Loss').length;
    
    const rrs = trades.map(t => parseFloat(t.rr) || 0).filter(v => v > 0);
    const avgRR = rrs.length > 0 ? rrs.reduce((a, b) => a + b, 0) / rrs.length : 0;

    const sessionDist: Record<Session, number> = { Asia: 0, London: 0, 'Pre-NY': 0, NY: 0 };
    const entryDist: Record<EntryType, number> = { 'Risk Entry': 0, 'Confirmation Entry': 0 };
    const ratingDist: Record<Rating, number> = { A: 0, B: 0, C: 0 };
    const riskDist: Record<RiskLevel, number> = { '0.25%': 0, '0.5%': 0, '1%': 0 };

    trades.forEach(t => {
      sessionDist[t.session]++;
      entryDist[t.entryType]++;
      ratingDist[t.rating]++;
      riskDist[t.risk]++;
    });

    return {
      totalTrades: total,
      wins,
      losses,
      winRate: total > 0 ? (wins / total) * 100 : 0,
      avgRR,
      sessionDistribution: sessionDist,
      entryTypeDistribution: entryDist,
      ratingDistribution: ratingDist,
      riskDistribution: riskDist,
    };
  }, [trades]);

  const COLORS = ['#10b981', '#f43f5e', '#3b82f6', '#f59e0b', '#8b5cf6'];

  const sessionData = Object.entries(stats.sessionDistribution).map(([name, value]) => ({ name, value }));
  const ratingData = Object.entries(stats.ratingDistribution).map(([name, value]) => ({ name, value }));
  const riskData = Object.entries(stats.riskDistribution).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Win Rate" value={`${stats.winRate.toFixed(1)}%`} subValue={`${stats.wins}W / ${stats.losses}L`} color="text-emerald-500" />
        <StatCard label="Average R:R" value={`${stats.avgRR.toFixed(2)}R`} subValue="Per Execution" color="text-zinc-100" />
        <StatCard label="Total Trades" value={stats.totalTrades.toString()} subValue="Life Time" color="text-zinc-100" />
        <StatCard label="Process Score" value="84" subValue="Discipline Index" color="text-indigo-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Session Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sessionData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sessionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '4px', fontSize: '12px' }}
                itemStyle={{ color: '#f4f4f5' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance by Rating">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={ratingData}>
              <XAxis dataKey="name" stroke="#52525b" fontSize={12} />
              <YAxis stroke="#52525b" fontSize={12} />
              <Tooltip 
                cursor={{ fill: '#18181b' }}
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '4px', fontSize: '12px' }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Risk Distribution">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={riskData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '4px', fontSize: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

// Fix: Use React.FC to properly type local components and ensure 'children' and other props are handled correctly in JSX
const StatCard: React.FC<{ label: string; value: string; subValue: string; color: string }> = ({ label, value, subValue, color }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow-sm">
    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-3xl font-black ${color} tracking-tighter`}>{value}</div>
    <div className="text-xs text-zinc-600 mt-2 font-mono uppercase">{subValue}</div>
  </div>
);

// Fix: Use React.FC to explicitly define 'children' as a prop, solving TS errors at call sites
const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-lg shadow-sm">
    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-3">{title}</h3>
    {children}
  </div>
);

export default Dashboard;
