import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { AlertTriangle, TrendingUp, CheckCircle, Activity } from 'lucide-react';
import { db, appId } from '../../services/firebase';
import GlassCard from '../../components/ui/GlassCard';

const MetricCard = ({ title, value, trend, color, border, icon: Icon }) => (
    <div className={`p-6 rounded-xl border backdrop-blur-sm relative overflow-hidden group transition-colors duration-300`} 
         style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', color: 'var(--glass-text)' }}>
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity" style={{ color: 'var(--glass-text)' }}>
            {Icon && <Icon size={48} />}
        </div>
        <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: 'var(--glass-text-muted)' }}>{title}</p>
        <div className="flex items-end justify-between relative z-10">
            <h3 className="text-3xl font-bold" style={{ color: 'var(--glass-text)' }}>{value}</h3>
            {trend && <span className="text-xs font-bold" style={{ color: color }}>{trend}</span>}
        </div>
    </div>
);

const ProgressBar = ({ label, pct, color }) => (
    <div>
        <div className="flex justify-between text-xs font-mono mb-2" style={{ color: 'var(--glass-text-muted)' }}>
            <span>{label}</span>
            <span>{pct}%</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--glass-border)' }}>
            <div className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000`} style={{ width: `${pct}%` }}></div>
        </div>
    </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    activeComplaints: 0,
    baggageClaims: 0,
    efficiency: 0,
    nps: 4.8, // Hardcoded for now as we don't have feedback mechanism yet
    criticals: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const complaintsRef = collection(db, 'artifacts', appId, 'public', 'data', 'complaints');
            
            // Get all docs for calculation (inefficient for large DBs, but fine for demo)
            const allDocsSnap = await getDocs(complaintsRef);
            console.log("Dashboard: Fetched", allDocsSnap.size, "records");
            const allDocs = allDocsSnap.docs.map(d => {
                const data = d.data();
                console.log("Record:", data.status, data.type);
                return data;
            });
            
            const active = allDocs.filter(d => d.status !== 'resolved').length;
            const baggage = allDocs.filter(d => d.type === 'baggage').length;
            const resolved = allDocs.filter(d => d.status === 'resolved').length;
            const total = allDocs.length;
            const efficiency = total > 0 ? Math.round((resolved / total) * 100) : 0;

            let criticals = [];
            try {
                // Get Criticals (Might fail if index is missing)
                const criticalQuery = query(complaintsRef, where('priority', '==', 'high'), where('status', '!=', 'resolved'), limit(3));
                const criticalSnap = await getDocs(criticalQuery);
                criticals = criticalSnap.docs.map(d => ({id: d.id, ...d.data()}));
            } catch (idxErr) {
                console.warn("Index missing for criticals?", idxErr);
                // Fallback: manually filter from allDocs
                criticals = allDocs.filter(d => d.priority === 'high' && d.status !== 'resolved').slice(0, 3)
                    .map((d, i) => ({id: `fallback-${i}`, ...d}));
            }

            setStats({
                activeComplaints: active,
                baggageClaims: baggage,
                efficiency,
                nps: 4.8,
                criticals
            });
        } catch (e) {
            console.error("Dashboard error:", e);
        } finally {
            setLoading(false);
        }
    };
    
    fetchStats();
    // Refresh every 30s
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-wide" style={{ color: 'var(--glass-text)' }}>COMMAND CENTER</h1>
            <div className="flex items-center gap-2 text-xs font-mono font-bold px-3 py-1 rounded border overflow-hidden" 
                 style={{ 
                     color: 'var(--accent-color)', 
                     borderColor: 'var(--glass-border)',
                     backgroundColor: 'var(--glass-bg)'
                 }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                LIVE DATA
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard title="Active Signals" value={stats.activeComplaints} trend={loading ? "..." : "Online"} color="var(--accent-color)" icon={Activity} />
            <MetricCard title="Baggage Ops" value={stats.baggageClaims} trend="Total Logged" color="var(--color-warning)" icon={AlertTriangle} />
            <MetricCard title="Resolution Rate" value={`${stats.efficiency}%`} trend="+5% vs Avg" color="var(--color-success)" icon={CheckCircle} />
            <MetricCard title="Satisfaction" value={stats.nps} trend="Stable" color="var(--color-purple)" icon={TrendingUp} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6 min-h-[300px]">
                <h3 className="font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--glass-text)' }}><AlertTriangle size={16} className="text-red-400"/> CRITICAL ATTENTION NEEDED</h3>
                <div className="space-y-4">
                    {stats.criticals.length > 0 ? (
                        stats.criticals.map(c => (
                            <div key={c.id} className="flex items-center gap-4 p-4 border-l-2 border-red-500 rounded-r-lg hover:opacity-80 transition-opacity cursor-pointer" 
                                 style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                                <span className="text-red-400 font-mono text-xs">{c.refId}</span>
                                <span className="text-sm truncate" style={{ color: 'var(--glass-text)' }}>{c.type === 'baggage' ? 'Lost Baggage' : 'Incident Report'} - {c.location}</span>
                                <span className="ml-auto text-xs text-red-300 font-bold uppercase">Urgent</span>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40" style={{ color: 'var(--glass-text-muted)' }}>
                            <CheckCircle size={40} className="mb-2 opacity-50" />
                            <p>No critical alerts active</p>
                        </div>
                    )}
                </div>
            </GlassCard>
            <GlassCard className="p-6">
                <h3 className="font-bold mb-6" style={{ color: 'var(--glass-text)' }}>SYSTEM METRICS</h3>
                <div className="space-y-6">
                    <ProgressBar label="Auto-Triage Confidence" pct={88} color="bg-cyan-500" />
                    <ProgressBar label="Customer Sentiment Analysis" pct={64} color="bg-purple-500" />
                    <ProgressBar label="Upload Recognition Rate" pct={92} color="bg-green-500" />
                </div>
            </GlassCard>
        </div>
    </div>
  );
};

export default Dashboard;
