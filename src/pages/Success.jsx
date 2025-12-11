import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';
import NeonButton from '../components/ui/NeonButton';

const Success = () => {
  const { t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state || {}; // Expect { refId, type }

  return (
    <div className="flex flex-col items-center justify-center text-center animate-fade-in-up">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-green-500 blur-[80px] opacity-20 animate-[pulse_4s_ease-in-out_infinite]" />
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-[bounce_3s_infinite]">
           <CheckCircle size={64} className="text-white" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-3">{t.success_title}</h2>
      <p className="text-white/60 mb-8 max-w-xs mx-auto leading-relaxed">{t.success_msg}</p>
      
      <GlassCard className="p-0 mb-8 w-full max-w-sm border-0 bg-white/5 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-green-500"></div>
        <div className="p-6">
            <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] text-white/40 uppercase tracking-[0.2em]">OFFICIAL TICKET</span>
                <span className="text-[10px] font-bold text-yellow-400 border border-yellow-400/30 px-2 py-0.5 rounded">LFW-Priority</span>
            </div>
            <span className="block text-4xl font-mono font-bold text-white tracking-wider drop-shadow-lg">{params.refId || 'ERR-000'}</span>
        </div>
        {/* Decorative Stamp */}
        <div className="absolute -bottom-4 -right-4 w-20 h-20 border-4 border-white/5 rounded-full flex items-center justify-center -rotate-12 opacity-50">
            <span className="text-[8px] text-white/20 font-bold uppercase">AIGE VERIFIED</span>
        </div>
      </GlassCard>

      <div className="w-full max-w-sm space-y-4">
        <NeonButton onClick={() => navigate('/tracking', { state: { refId: params.refId } })}>
          {t.track_btn}
        </NeonButton>
        <button onClick={() => navigate('/')} className="w-full py-4 text-white/50 font-medium hover:text-white transition-colors">
          Return Home
        </button>
      </div>
    </div>
  );
};

export default Success;
