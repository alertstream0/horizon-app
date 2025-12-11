import React from 'react';

const GlassCard = ({ children, className = "", onClick, hoverEffect = false }) => (
  <div 
    onClick={onClick}
    style={{
        backgroundColor: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        color: 'var(--glass-text)'
    }}
    className={`
      relative overflow-hidden
      backdrop-blur-md border 
      rounded-3xl shadow-xl
      transition-all duration-500 ease-out
      ${hoverEffect ? 'hover:scale-[1.02] cursor-pointer group' : ''}
      ${className}
    `}
  >
    {/* Shine effect on hover */}
    {hoverEffect && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform" />}
    {children}
  </div>
);

export default GlassCard;
