import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, Search, MapPin } from 'lucide-react';
import { query, collection, where, getDocs } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';

const Tracking = () => {
  const { t, user } = useApp();
  const navigate = useNavigate();
  const locationState = useLocation().state || {};
  
  const [search, setSearch] = useState(locationState.refId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-search if refId is passed in state
  useEffect(() => {
    if (locationState.refId && user) {
        handleTrack();
    }
  }, [locationState.refId, user]);

  const handleTrack = async () => {
    if(!user) return;
    setLoading(true);
    setResult(null);
    try {
        const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), where('refId', '==', search));
        const snap = await getDocs(q);
        if (!snap.empty) setResult(snap.docs[0].data());
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <button onClick={() => navigate('/')} className="mb-6 text-white/50 hover:text-white flex items-center gap-2 transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      <GlassCard className="p-8 mb-6">
        <h2 className="text-2xl font-bold text-white mb-6">{t.track_btn}</h2>
        <div className="flex gap-3">
          <GlassInput 
            placeholder="REF-XXXXXX"
            className="text-center uppercase font-mono tracking-widest text-lg"
            value={search}
            onChange={e => setSearch(e.target.value.toUpperCase())}
          />
          <button 
              onClick={handleTrack}
              className="bg-cyan-500 hover:bg-cyan-400 text-black rounded-xl px-6 transition-all"
          >
              {loading ? <Loader2 className="animate-spin" /> : <Search />}
          </button>
        </div>
      </GlassCard>

      {result && (
        <GlassCard className="p-8 animate-fade-in-up !bg-gradient-to-br !from-slate-900/80 !to-black/80">
            <div className="flex justify-between items-start mb-8">
                <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">{result.type}</span>
                    <h3 className="text-3xl font-bold text-white mt-1">{result.refId}</h3>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border ${result.status === 'resolved' ? 'border-green-500 text-green-400 bg-green-500/10' : 'border-cyan-500 text-cyan-400 bg-cyan-500/10'}`}>
                  {result.status}
                </div>
            </div>
            
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-white/80 bg-white/5 p-4 rounded-xl">
                    <MapPin className="text-cyan-400" size={20} /> 
                    <span>{result.location}</span>
                </div>
                
                {/* Timeline */}
                <div className="relative pt-6 pl-2">
                    <div className="absolute left-[9px] top-8 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-transparent"></div>
                    
                    <div className="relative flex gap-4 mb-8">
                        <div className="w-5 h-5 rounded-full bg-cyan-500 border-4 border-black shadow-[0_0_10px_rgba(34,211,238,0.8)] z-10"></div>
                        <div>
                           <p className="text-white font-bold text-sm">Report Received</p>
                           <p className="text-xs text-white/40">Request initiated</p>
                        </div>
                    </div>
                    {result.status !== 'new' && (
                       <div className="relative flex gap-4">
                           <div className="w-5 h-5 rounded-full bg-blue-500 border-4 border-black z-10 animate-pulse"></div>
                           <div>
                              <p className="text-white font-bold text-sm">Processing</p>
                              <p className="text-xs text-white/40">Staff assigned</p>
                           </div>
                       </div>
                    )}
                </div>
            </div>
        </GlassCard>
      )}
    </div>
  );
};

export default Tracking;
