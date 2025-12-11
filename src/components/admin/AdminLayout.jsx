import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { BarChart3, MessageSquare, Briefcase, LogOut, Search, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const AdminLayout = () => {
  const { t } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const NavItem = ({ icon, label, target, active }) => (
    <button 
      onClick={() => navigate(target)}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
        ${active 
          ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400 text-white' 
          : 'text-white/40 hover:text-white hover:bg-white/5 border-l-2 border-transparent'}
      `}
    >
      <div className={`${active ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]' : 'group-hover:text-cyan-400'}`}>
        {icon}
      </div>
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 flex bg-[#050510] text-slate-100 overflow-hidden font-mono">
      {/* Sidebar */}
      <aside className="w-72 bg-black/40 backdrop-blur-xl border-r border-white/5 flex flex-col relative z-20">
        <div className="p-8">
            <h2 className="font-bold text-2xl tracking-widest text-white">NEXUS</h2>
            <p className="text-[10px] text-cyan-500 uppercase tracking-[0.3em]">Operational Grid</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
            <NavItem icon={<BarChart3 size={18}/>} label={t.dashboard} target="/admin/dashboard" active={currentPath === '/admin/dashboard'} />
            <NavItem icon={<MessageSquare size={18}/>} label={t.claims} target="/admin/claims" active={currentPath === '/admin/claims'} />
            <NavItem icon={<Briefcase size={18}/>} label={t.baggage} target="/admin/baggage" active={currentPath === '/admin/baggage'} />
        </nav>
        <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-lg mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-green-400">System Online</span>
            </div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-4 py-2 w-full">
                <LogOut size={14} /> Terminate
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-sm">
             <div className="flex items-center gap-4">
                <Search className="text-white/30" size={18}/>
                <input placeholder="SEARCH DATABASE..." className="bg-transparent text-sm text-white placeholder-white/20 outline-none w-64 font-mono uppercase" />
             </div>
             <div className="flex items-center gap-6">
                 <Bell className="text-white/40 hover:text-cyan-400 cursor-pointer" size={20} />
                 <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-blue-700 border border-white/20 flex items-center justify-center font-bold text-xs">OP</div>
             </div>
        </header>
        <div className="flex-1 overflow-auto p-8 relative">
            <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
