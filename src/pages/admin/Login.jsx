import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import NeonButton from '../../components/ui/NeonButton';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('agent'); // 'agent' or 'supervisor'

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Fake login
    setTimeout(() => { 
        setLoading(false); 
        // Store role in localStorage for Layout to use (optional, but good for persistence)
        localStorage.setItem('horizon_role', role);
        
        if (role === 'supervisor') {
            navigate('/admin/dashboard');
        } else {
            navigate('/admin/claims');
        }
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-1">
        <GlassCard className="p-8 !bg-black/60 border-t-4 border-t-cyan-500">
          <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white tracking-widest">HORIZON <span className="text-cyan-400">OS</span></h1>
              <div className="flex justify-center mt-4 bg-white/5 rounded-lg p-1">
                  <button 
                    onClick={() => setRole('agent')}
                    className={`px-4 py-1 text-xs font-bold uppercase tracking-wider rounded transition-all ${role === 'agent' ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/50' : 'text-white/40 hover:text-white'}`}
                  >
                    Agent
                  </button>
                  <button 
                    onClick={() => setRole('supervisor')}
                    className={`px-4 py-1 text-xs font-bold uppercase tracking-wider rounded transition-all ${role === 'supervisor' ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50' : 'text-white/40 hover:text-white'}`}
                  >
                    Supervisor
                  </button>
              </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{role === 'supervisor' ? 'Admin ID' : 'Agent ID'}</label>
                  <GlassInput placeholder={role === 'supervisor' ? 'SUP-001' : 'AGT-429'} />
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Passkey</label>
                  <GlassInput type="password" placeholder="••••••" />
              </div>
              <NeonButton className={`mt-4 ${role === 'supervisor' ? '!bg-purple-500 !shadow-purple-500/50' : ''}`}>
                  {loading ? <Loader2 className="animate-spin" /> : "Initialize Session"}
              </NeonButton>
          </form>
          <button onClick={() => navigate('/')} className="w-full mt-6 text-xs text-white/30 hover:text-white transition-colors uppercase tracking-widest">
              Exit to Terminal
          </button>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminLogin;
