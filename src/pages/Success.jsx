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
        <div className="absolute inset-0 bg-cyan-500 blur-[60px] opacity-40 animate-pulse" />
        <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
           <CheckCircle size={56} className="text-white" />
        </div>
      </div>
      
      <h2 className="text-4xl font-extrabold text-white mb-2">{t.success_title}</h2>
      <p className="text-cyan-100/70 mb-8 max-w-xs mx-auto">{t.success_msg}</p>
      
      <GlassCard className="p-6 mb-8 w-full max-w-sm border-l-4 border-l-cyan-400">
        <span className="block text-xs text-white/40 uppercase tracking-[0.2em] mb-2">Reference ID</span>
        <span className="block text-4xl font-mono font-bold text-white tracking-wider drop-shadow-lg">{params.refId || 'ERR-000'}</span>
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
