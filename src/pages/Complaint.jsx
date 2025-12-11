import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Sparkles, Smile, AlertTriangle, Shield, User, Briefcase, MapPin, Camera, Mic, Loader2, Upload } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import { useApp } from '../context/AppContext';
import useStorage from '../hooks/useStorage';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import NeonButton from '../components/ui/NeonButton';

const CATEGORIES = [
  { id: 'cleanliness', icon: <Sparkles className="w-6 h-6" />, label: { en: "Cleanliness", fr: "Propreté", ar: "نظافة" }, color: "from-teal-400 to-emerald-500" },
  { id: 'comfort', icon: <Smile className="w-6 h-6" />, label: { en: "Comfort", fr: "Confort", ar: "راحة" }, color: "from-amber-400 to-orange-500" },
  { id: 'info', icon: <AlertTriangle className="w-6 h-6" />, label: { en: "Signage", fr: "Signalisation", ar: "لافتات" }, color: "from-blue-400 to-indigo-500" },
  { id: 'security', icon: <Shield className="w-6 h-6" />, label: { en: "Security", fr: "Sécurité", ar: "أمن" }, color: "from-red-400 to-pink-500" },
  { id: 'staff', icon: <User className="w-6 h-6" />, label: { en: "Staff", fr: "Personnel", ar: "طاقم عمل" }, color: "from-purple-400 to-violet-500" },
  { id: 'shops', icon: <Briefcase className="w-6 h-6" />, label: { en: "Shops", fr: "Commerces", ar: "متاجر" }, color: "from-cyan-400 to-blue-500" },
];

const Complaint = () => {
  const { t, user, lang } = useApp();
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const locationState = useLocation().state || {};
  
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ category: '', location: '', desc: '', files: [] });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { uploadFile, progress: uploadProgress, isUploading } = useStorage();

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const url = await uploadFile(file, `complaints/${Date.now()}_${file.name}`);
        setData(prev => ({ ...prev, files: [...prev.files, url] }));
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) return; // Should handle auth prompt if needed
    setIsSubmitting(true);
    try {
      const refId = `CMP-${Math.floor(100000 + Math.random() * 900000)}`;
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), {
        refId, type: 'complaint', ...data, status: 'new', priority: 'medium',
        createdAt: serverTimestamp(), lang, userId: user.uid
      });
      setTimeout(() => navigate('/success', { state: { refId, type: 'complaint' } }), 1000); // Fake delay for smooth feel
    } catch (e) { 
      console.error("Error submitting complaint:", e);
      setIsSubmitting(false); 
    }
  };

  return (
    <GlassCard className="w-full max-w-lg mx-auto p-1 !bg-black/20">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => step === 1 ? navigate('/') : setStep(step - 1)} className="text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            {[1, 2].map(i => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step >= i ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]' : 'bg-white/10'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-2xl font-bold text-center text-white mb-6">{t.categories}</h2>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => { setData({...data, category: cat.id}); setStep(2); }}
                  className="cursor-pointer group relative overflow-hidden rounded-2xl aspect-[4/3] bg-white/5 border border-white/5 hover:border-white/30 transition-all duration-300"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-2">
                    <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform text-white">
                      {cat.icon}
                    </div>
                    <span className="font-medium text-sm text-white/90">{cat.label[lang]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in space-y-6">
            <h2 className="text-2xl font-bold text-white">{t.desc_label}</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest ml-1">{t.location}</label>
              <div className="relative group">
                <MapPin className="absolute top-4 left-4 text-white/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
                <GlassInput 
                  placeholder={t.location_placeholder}
                  value={data.location}
                  onChange={(e) => setData({...data, location: e.target.value})}
                  className="pl-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest ml-1">Details</label>
              <textarea 
                rows={4}
                placeholder={t.desc_placeholder}
                value={data.desc}
                onChange={(e) => setData({...data, desc: e.target.value})}
                className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/40 outline-none focus:bg-black/40 focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all resize-none"
              />
            </div>

            <div className="flex gap-4">
               <button 
                  onClick={() => document.getElementById('file-upload').click()}
                  className="flex-1 py-4 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-white/50 hover:bg-white/5 hover:text-white hover:border-cyan-400/50 transition-all"
               >
                  {isUploading ? <Loader2 className="animate-spin mb-2" /> : <Camera size={24} className="mb-2" />}
                  <span className="text-xs font-bold">Photo</span>
               </button>
               <button className="flex-1 py-4 border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center text-white/50 hover:bg-white/5 hover:text-white hover:border-cyan-400/50 transition-all">
                  <Mic size={24} className="mb-2" />
                  <span className="text-xs font-bold">Audio</span>
               </button>
            </div>

            {data.files.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.files.map((file, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20">
                    <img src={file} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
            
            {uploadProgress > 0 && uploadProgress < 100 && (
                 <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-cyan-400 h-full transition-all" style={{width: `${uploadProgress}%`}}></div>
                 </div>
            )}
            
            <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileSelect}
            />

            <NeonButton 
              onClick={handleSubmit}
              disabled={!data.location || !data.desc || isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" /> : t.submit}
            </NeonButton>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default Complaint;
