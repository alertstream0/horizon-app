import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Plane, Globe, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import GlassCard from '../ui/GlassCard';

const ClientLayout = () => {
    const { lang, setLang, user } = useApp();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen">
             <header className="fixed top-0 left-0 right-0 z-40 p-4">
                <GlassCard className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between !rounded-2xl !bg-black/30 backdrop-blur-xl">
                    <div 
                    className="flex items-center gap-3 cursor-pointer group" 
                    onClick={() => navigate('/')}
                    >
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-110 transition-transform">
                        <Plane className="text-white w-5 h-5 transform -rotate-45" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white hidden sm:block">HORIZON</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setLang(lang === 'en' ? 'fr' : lang === 'fr' ? 'ar' : 'en')}
                        className="flex items-center gap-2 text-sm font-semibold text-white/70 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all"
                    >
                        <Globe size={16} />
                        {lang.toUpperCase()}
                    </button>
                    
                    {user ? (
                        <div 
                          onClick={() => navigate('/profile')} 
                          className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/20 flex items-center justify-center cursor-pointer hover:border-white transition-all shadow-lg shadow-cyan-500/20"
                        >
                            <span className="font-bold text-xs text-white">{user.displayName ? user.displayName[0].toUpperCase() : <User size={14} />}</span>
                        </div>
                    ) : (
                        <button 
                            onClick={() => navigate('/auth')}
                            className="text-xs font-bold text-white/70 hover:text-white border border-white/10 hover:bg-white/10 px-4 py-2 rounded-lg transition-all"
                        >
                            SIGN IN
                        </button>
                    )}
                    </div>
                </GlassCard>
            </header>

            <main className="w-full pt-24 pb-12 px-4 min-h-screen flex flex-col items-center justify-center">
                <Outlet />
            </main>
        </div>
    );
};

export default ClientLayout;
