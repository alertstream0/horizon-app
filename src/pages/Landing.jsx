import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Briefcase, ChevronRight, Smile, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassCard from '../components/ui/GlassCard';

const Landing = () => {
  const { t } = useApp();
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 animate-fade-in-up">
      <div className="text-center mb-6">
        <div className="inline-block px-3 py-1 bg-white/10 rounded-full border border-white/10 backdrop-blur-md mb-4">
            <span className="text-[10px] font-bold text-yellow-400 tracking-[0.2em] uppercase">LFW • LOMÉ-TOKOIN</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-green-200 mb-2 drop-shadow-sm leading-tight">
          {t.welcome}
        </h1>
        <p className="text-lg text-white/60 font-light tracking-wide max-w-sm mx-auto">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <GlassCard 
          hoverEffect 
          onClick={() => navigate('/complaint', { state: { type: 'problem' } })}
          className="p-6 group"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white group-hover:text-pink-200 transition-colors">{t.btn_report}</h3>
                <p className="text-sm text-pink-200/60">Facilities, Service, Quality</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-pink-600 transition-all">
              <ChevronRight />
            </div>
          </div>
        </GlassCard>

        <GlassCard 
          hoverEffect 
          onClick={() => navigate('/baggage')}
          className="p-6 group"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-5">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                <Briefcase className="text-white w-8 h-8" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-white group-hover:text-orange-200 transition-colors">{t.btn_baggage}</h3>
                <p className="text-sm text-orange-200/60">{t.baggage_sub}</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-orange-600 transition-all">
              <ChevronRight />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2">
        <GlassCard hoverEffect onClick={() => navigate('/complaint', { state: { type: 'suggestion' } })} className="p-4 flex flex-col items-center justify-center gap-2">
          <Smile className="text-cyan-300" />
          <span className="font-medium text-sm text-center">{t.btn_suggestion}</span>
        </GlassCard>
        <GlassCard hoverEffect onClick={() => navigate('/tracking')} className="p-4 flex flex-col items-center justify-center gap-2">
          <Search className="text-cyan-300" />
          <span className="font-medium text-sm text-center">{t.btn_track}</span>
        </GlassCard>
      </div>
    </div>
  );
};

export default Landing;
