import React from 'react';

const GlassCard = ({ children, className = "", onClick, hoverEffect = false }) => (
  <div 
    onClick={onClick}
    className={`
      relative overflow-hidden
      bg-white/10 backdrop-blur-md border border-white/10 
      rounded-3xl shadow-2xl shadow-black/20
      transition-all duration-500 ease-out
      ${hoverEffect ? 'hover:bg-white/15 hover:scale-[1.02] hover:shadow-cyan-500/20 hover:border-white/20 cursor-pointer group' : ''}
      ${className}
    `}
  >
    {/* Shine effect on hover */}
    {hoverEffect && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform" />}
    {children}
  </div>
);

export default GlassCard;
