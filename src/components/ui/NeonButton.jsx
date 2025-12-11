import React from 'react';

const NeonButton = ({ children, onClick, disabled, variant = 'primary', className = "" }) => {
  const baseStyle = "relative w-full py-4 rounded-xl font-bold tracking-wide transition-all duration-300 transform active:scale-[0.98] overflow-hidden flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:brightness-110",
    secondary: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
    danger: "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
  };
  
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${disabled ? 'opacity-50 grayscale cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

export default NeonButton;
