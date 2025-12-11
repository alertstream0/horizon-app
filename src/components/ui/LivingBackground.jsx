import React from 'react';

const LivingBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-900">
    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-[100px] animate-pulse mix-blend-screen" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-700 mix-blend-screen" />
    <div className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-cyan-500/20 rounded-full blur-[80px] animate-pulse delay-1000 mix-blend-screen" />
    {/* Grid Overlay for Texture */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
  </div>
);

export default LivingBackground;
