import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Clock, ArrowLeft, FolderOpen } from 'lucide-react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

const Profile = () => {
    const { user, logout } = useApp();
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        const fetchHistory = async () => {
            try {
                const q = query(
                    collection(db, 'artifacts', appId, 'public', 'data', 'complaints'),
                    where('userId', '==', user.uid)
                    // orderBy('createdAt', 'desc') // Removed to avoid missing index error
                );
                const snapshot = await getDocs(q);
                const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                // Sort in memory
                results.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
                setHistory(results);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, navigate]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="min-h-screen p-4 md:p-8 pt-24 max-w-4xl mx-auto">
            <button 
                onClick={() => navigate('/')} 
                className="mb-6 text-white/50 hover:text-white flex items-center gap-2 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Home
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info Card */}
                <GlassCard className="md:col-span-1 p-6 h-fit !bg-blue-900/10 border-blue-500/30">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-[2px] mb-4">
                            <div className="w-full h-full rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">
                                    {user.displayName ? user.displayName[0].toUpperCase() : <User size={40} />}
                                </span>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-1">{user.displayName || 'Traveler'}</h2>
                        <p className="text-white/40 text-sm mb-6">{user.email}</p>
                        
                        <NeonButton onClick={handleLogout} variant="danger" className="w-full">
                            <LogOut size={16} className="mr-2" /> Sign Out
                        </NeonButton>
                    </div>
                </GlassCard>

                {/* History Section */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock className="text-cyan-400" /> recent Activity
                    </h3>

                    {loading ? (
                        <div className="text-white/30 text-center py-10">Loading history...</div>
                    ) : history.length === 0 ? (
                        <GlassCard className="p-8 text-center !bg-white/5">
                            <FolderOpen size={48} className="mx-auto text-white/20 mb-4" />
                            <p className="text-white/40">No reports found.</p>
                            <button onClick={() => navigate('/complaint')} className="mt-4 text-cyan-400 hover:text-cyan-300 text-sm font-bold">
                                Report an Issue
                            </button>
                        </GlassCard>
                    ) : (
                        <div className="space-y-3">
                            {history.map(item => (
                                <GlassCard key={item.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-12 rounded-full ${item.status === 'resolved' ? 'bg-green-500' : item.status === 'in_progress' ? 'bg-yellow-500' : 'bg-cyan-500'}`} />
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-mono text-cyan-400 font-bold">{item.refId}</span>
                                                <span className="text-[10px] uppercase bg-white/10 px-2 py-0.5 rounded text-white/60">{item.type}</span>
                                            </div>
                                            <p className="text-white/60 text-sm line-clamp-1">{item.desc || item.location}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${item.status === 'resolved' ? 'text-green-400' : 'text-cyan-400'}`}>
                                            {item.status.replace('_', ' ')}
                                        </div>
                                        <div className="text-[10px] text-white/30">
                                            {item.createdAt?.toDate().toLocaleDateString()}
                                        </div>
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
