import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Loader2, Plane, FileText, Ticket, Tag as TagIcon, X } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import { useApp } from '../context/AppContext';
import useStorage from '../hooks/useStorage';
import GlassCard from '../components/ui/GlassCard';
import GlassInput from '../components/ui/GlassInput';
import NeonButton from '../components/ui/NeonButton';

const Baggage = () => {
  const { t, user, lang } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ flight: '', desc: '', boardingPass: '', baggageTag: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { uploadFile, isUploading } = useStorage();

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadFile(file, `baggage/${type}`);
      setFormData(prev => ({ ...prev, [type]: url }));
    } catch (err) {
      console.error(err);
      alert(`Upload failed: ${err.message || err}`);
    }
  };

  const removeFile = (type) => {
    setFormData(prev => ({ ...prev, [type]: '' }));
  };

  const handleSubmit = async () => {
    if(!user) return;
    setIsSubmitting(true);
    try {
      const refId = `BAG-${Math.floor(100000 + Math.random() * 900000)}`;
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), {
          refId, 
          type: 'baggage', 
          category: 'loss', 
          ...formData,
          status: 'new', 
          priority: 'high', 
          createdAt: serverTimestamp(), 
          lang, 
          userId: user.uid
      });
      navigate('/success', { state: { refId, type: 'baggage' } });
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  const UploadBox = ({ type, label, icon: Icon, value, instruction }) => (
    <div className="space-y-2">
      <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest ml-1">{label}</label>
      {value ? (
        <div className="relative h-32 w-full rounded-2xl overflow-hidden border border-white/20 group">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button 
                onClick={() => removeFile(type)}
                className="p-2 bg-red-500/80 rounded-full text-white hover:bg-red-500 transition-colors"
             >
                <X size={20} />
             </button>
          </div>
        </div>
      ) : (
        <label className="cursor-pointer group h-32 w-full border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center hover:bg-white/5 hover:border-cyan-400/50 transition-all relative overflow-hidden">
          {isUploading ? (
             <Loader2 className="animate-spin text-cyan-400" />
          ) : (
            <>
               <div className="p-3 bg-white/5 rounded-full mb-2 group-hover:scale-110 transition-transform text-white/70 group-hover:text-cyan-400">
                  <Icon size={24} />
               </div>
               <span className="text-xs text-white/40 group-hover:text-white/80 transition-colors text-center px-2">{instruction || t.upload_proof || "Upload"}</span>
            </>
          )}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={(e) => handleFileUpload(e, type)}
            disabled={!user || isUploading}
          />
        </label>
      )}
    </div>
  );

  return (
    <GlassCard className="w-full max-w-lg mx-auto p-1 !bg-black/20">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all text-white">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">{t.btn_baggage}</h2>
        </div>

        <div className="space-y-4 animate-fade-in">
          {/* Flight Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest ml-1">{t.flight_num}</label>
            <div className="relative group">
              <Plane className="absolute top-4 left-4 text-white/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
              <GlassInput 
                placeholder={t.flight_placeholder}
                value={formData.flight}
                onChange={e => setFormData({...formData, flight: e.target.value})}
                className="pl-12"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest ml-1">{t.baggage_desc}</label>
            <div className="relative group">
               <FileText className="absolute top-4 left-4 text-white/50 group-focus-within:text-cyan-400 transition-colors" size={20} />
               <textarea 
                  rows={3}
                  value={formData.desc}
                  onChange={e => setFormData({...formData, desc: e.target.value})}
                  className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/40 outline-none focus:bg-black/40 focus:border-cyan-400/50 focus:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all resize-none"
                  placeholder="..."
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
             <UploadBox 
              type="boardingPass" 
              label={t.boarding_pass} 
              icon={Ticket} 
              value={formData.boardingPass} 
              instruction={t.scan_boarding}
             />
             <UploadBox 
              type="baggageTag" 
              label={t.baggage_tag} 
              icon={TagIcon} 
              value={formData.baggageTag} 
              instruction={t.scan_tag} 
             />
          </div>

          {/* Contact Info Section */}
            <div className="space-y-4 pt-4 border-t border-white/10">
                <h3 className="text-sm font-bold text-white/70 uppercase tracking-widest">Restons en contact</h3>
                <GlassInput 
                    placeholder="Votre Nom (Optionnel)"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <div className="flex gap-2">
                     <button 
                        onClick={() => setFormData({...formData, contactMethod: 'email'})}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.contactMethod === 'email' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-white/10 text-white/40 hover:bg-white/5'}`}
                     >
                        Email
                     </button>
                     <button 
                         onClick={() => setFormData({...formData, contactMethod: 'phone'})}
                         className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${formData.contactMethod === 'phone' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400' : 'border-white/10 text-white/40 hover:bg-white/5'}`}
                     >
                        Téléphone
                     </button>
                </div>
                {formData.contactMethod && (
                    <GlassInput 
                        placeholder={formData.contactMethod === 'email' ? "ex: voyageur@mail.com" : "ex: +228 90 00 00 00"}
                        value={formData.contactValue || ''}
                        onChange={(e) => setFormData({...formData, contactValue: e.target.value})}
                    />
                )}
            </div>

          <NeonButton 
            onClick={handleSubmit} 
            className="mt-6"
            disabled={!formData.flight || !formData.desc || !formData.boardingPass || !formData.baggageTag || isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : t.submit}
          </NeonButton>
        </div>
      </div>
    </GlassCard>
  );
};

export default Baggage;
