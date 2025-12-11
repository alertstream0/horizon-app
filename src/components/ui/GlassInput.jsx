import React from 'react';

const GlassInput = (props) => (
  <input 
    {...props}
    className={`
      w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4
      text-white placeholder-white/40 outline-none
      focus:bg-black/40 focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)]
      transition-all duration-300
      ${props.className || ''}
    `}
  />
);

export default GlassInput;
