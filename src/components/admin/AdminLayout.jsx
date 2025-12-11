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
          ? 'bg-gradient-to-r from-cyan-500/20 to-transparent border-l-2 border-cyan-400' 
          : 'hover:bg-white/5 border-l-2 border-transparent'}
      `}
      style={{
          color: active ? 'var(--glass-text)' : 'var(--glass-text-muted)',
          borderColor: active ? 'var(--accent-color)' : 'transparent'
      }}
    >
      <div style={{ color: active ? 'var(--accent-color)' : 'inherit' }} className="group-hover:text-cyan-400 transition-colors">
        {icon}
      </div>
      {label}
    </button>
  );

  const [theme, setTheme] = React.useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'light') {
        document.documentElement.classList.add('light-mode');
    } else {
        document.documentElement.classList.remove('light-mode');
    }
  };

  return (
    <div className={`fixed inset-0 flex bg-[var(--bg-main)] text-[var(--text-main)] overflow-hidden font-mono transition-colors duration-300`}>
      {/* Sidebar */}
      <aside className="w-72 bg-[var(--glass-bg)] backdrop-blur-xl border-r border-[var(--glass-border)] flex flex-col relative z-20 transition-colors duration-300">
        <div className="p-8">
            <h2 className="font-bold text-2xl tracking-widest" style={{ color: 'var(--glass-text)' }}>{t.nexus_title}</h2>
            <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: 'var(--accent-color)' }}>{t.op_grid}</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
            <NavItem icon={<BarChart3 size={18}/>} label={t.dashboard} target="/admin/dashboard" active={currentPath === '/admin/dashboard'} />
            <NavItem icon={<MessageSquare size={18}/>} label={t.claims} target="/admin/claims" active={currentPath === '/admin/claims'} />
            <NavItem icon={<Briefcase size={18}/>} label={t.baggage} target="/admin/baggage" active={currentPath === '/admin/baggage'} />
        </nav>
        <div className="p-4 border-t border-[var(--glass-border)]">
            <div className="flex items-center gap-3 px-4 py-2 bg-[var(--glass-border)] rounded-lg mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold" style={{ color: '#22c55e' }}>{t.sys_online}</span>
            </div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-4 py-2 w-full transition-colors">
                <LogOut size={14} /> {t.terminate}
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,120,120,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(120,120,120,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        <header className="h-20 border-b border-[var(--glass-border)] flex items-center justify-between px-8 bg-[var(--glass-bg)] backdrop-blur-sm transition-colors duration-300">
             <div className="flex items-center gap-4">
                <Search className="opacity-30" size={18}/>
                <input placeholder={t.search_db} className="bg-transparent text-sm placeholder-opacity-30 outline-none w-64 font-mono uppercase" style={{ color: 'var(--text-main)', placeholderColor: 'var(--glass-text-muted)' }} />
             </div>
             <div className="flex items-center gap-6">
                 <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--glass-border)] transition-colors" title="Toggle Theme">
                    {theme === 'dark' ? '🌙' : '☀️'}
                 </button>
                 <Bell className="opacity-40 hover:text-cyan-400 cursor-pointer" size={20} />
                 <div className="w-8 h-8 rounded bg-gradient-to-tr from-cyan-600 to-blue-700 border border-white/20 flex items-center justify-center font-bold text-xs text-white">OP</div>
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
