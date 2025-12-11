import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import NeonButton from '../../components/ui/NeonButton';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Fake login
    setTimeout(() => { setLoading(false); navigate('/admin/dashboard'); }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-1">
        <GlassCard className="p-8 !bg-black/60 border-t-4 border-t-cyan-500">
          <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white tracking-widest">HORIZON <span className="text-cyan-400">OS</span></h1>
              <p className="text-white/30 text-xs uppercase tracking-[0.3em] mt-2">Restricted Access</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Operator ID</label>
                  <GlassInput placeholder="ID" />
              </div>
              <div className="space-y-1">
                  <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Passkey</label>
                  <GlassInput type="password" placeholder="••••••" />
              </div>
              <NeonButton className="mt-4">
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
