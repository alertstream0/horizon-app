import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { signUp, signIn } from '../../services/auth';
import GlassCard from '../../components/ui/GlassCard';
import GlassInput from '../../components/ui/GlassInput';
import NeonButton from '../../components/ui/NeonButton';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(formData.email, formData.password, formData.name);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Home
      </button>

      <GlassCard className="w-full max-w-md p-8 !bg-black/60 border-t-4 border-t-cyan-500">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Join Horizon'}
            </h1>
            <p className="text-white/40 text-sm">
              {isLogin ? 'Sign in to access your account' : 'Start your journey with us'}
            </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                  <div className="relative">
                    <User className="absolute top-4 left-4 text-white/30" size={18} />
                    <GlassInput 
                      placeholder="Full Name" 
                      className="pl-12"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required={!isLogin}
                    />
                  </div>
              </div>
            )}
            
            <div className="space-y-1">
                <div className="relative">
                  <Mail className="absolute top-4 left-4 text-white/30" size={18} />
                  <GlassInput 
                    type="email"
                    placeholder="Email Address" 
                    className="pl-12"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
            </div>

            <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute top-4 left-4 text-white/30" size={18} />
                  <GlassInput 
                    type="password" 
                    placeholder="Password" 
                    className="pl-12"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
            </div>

            <NeonButton className="mt-6" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Create Account")}
            </NeonButton>
        </form>

        <div className="mt-6 text-center text-sm text-white/40">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Auth;
