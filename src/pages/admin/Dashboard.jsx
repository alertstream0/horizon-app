import React from 'react';
import { AlertTriangle } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';

const MetricCard = ({ title, value, trend, color, border }) => (
    <div className={`bg-black/40 p-6 rounded-xl border ${border} backdrop-blur-sm`}>
        <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">{title}</p>
        <div className="flex items-end justify-between">
            <h3 className="text-3xl font-bold text-white">{value}</h3>
            <span className={`text-xs font-bold ${color}`}>{trend}</span>
        </div>
    </div>
);

const ProgressBar = ({ label, pct, color }) => (
    <div>
        <div className="flex justify-between text-xs font-mono text-white/60 mb-2">
            <span>{label}</span>
            <span>{pct}</span>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className={`h-full ${color} shadow-[0_0_10px_currentColor]`} style={{ width: pct }}></div>
        </div>
    </div>
);

const Dashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white tracking-wide">DASHBOARD</h1>
            <span className="text-xs font-mono text-cyan-500 border border-cyan-500/30 px-3 py-1 rounded bg-cyan-900/10">LIVE FEED ACTIVE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard title="Active Signals" value="24" trend="+12%" color="text-cyan-400" border="border-cyan-500/30" />
            <MetricCard title="Baggage Alerts" value="8" trend="-2%" color="text-orange-400" border="border-orange-500/30" />
            <MetricCard title="Efficiency" value="94%" trend="+5%" color="text-green-400" border="border-green-500/30" />
            <MetricCard title="NPS Score" value="4.8" trend="0%" color="text-purple-400" border="border-purple-500/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6 !bg-black/40 !rounded-xl !border-white/5">
                <h3 className="font-bold text-white/80 mb-6 flex items-center gap-2"><AlertTriangle size={16} className="text-red-400"/> CRITICAL ALERTS</h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-red-500/10 border-l-2 border-red-500 rounded-r-lg">
                        <span className="text-red-400 font-mono text-xs">ERR-01</span>
                        <span className="text-sm text-white/80">Spill reported at Gate A4</span>
                        <span className="ml-auto text-xs text-white/30">2m</span>
                    </div>
                     <div className="flex items-center gap-4 p-4 bg-yellow-500/10 border-l-2 border-yellow-500 rounded-r-lg">
                        <span className="text-yellow-400 font-mono text-xs">WRN-04</span>
                        <span className="text-sm text-white/80">Queue overflow Security 2</span>
                        <span className="ml-auto text-xs text-white/30">15m</span>
                    </div>
                </div>
            </GlassCard>
            <GlassCard className="p-6 !bg-black/40 !rounded-xl !border-white/5">
                <h3 className="font-bold text-white/80 mb-6">SYSTEM LOAD</h3>
                <div className="space-y-6">
                    <ProgressBar label="Cleanliness" pct="45%" color="bg-cyan-500" />
                    <ProgressBar label="Signage" pct="20%" color="bg-purple-500" />
                    <ProgressBar label="Staff" pct="15%" color="bg-green-500" />
                </div>
            </GlassCard>
        </div>
    </div>
  );
};

export default Dashboard;
