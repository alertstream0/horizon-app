import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Camera, CheckCircle, Upload, Loader2 } from 'lucide-react';
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
  const [scanning, setScanning] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [formData, setFormData] = useState({ flight: '', tag: '', desc: '' });

  const { uploadFile, isUploading } = useStorage();

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setScanning(true);
      // Real upload
      const url = await uploadFile(file, `baggage/${Date.now()}_${file.name}`);
      console.log("Uploaded proof:", url);
      
      // Simulate OCR processing time
      setTimeout(() => {
        setScanning(false);
        setExtracted(true);
        // In a real app, we would send 'url' to an OCR API here
        setFormData({ flight: 'AF345', tag: '057-2391823', desc: 'Black Samsonite hard shell', proofUrl: url });
      }, 2000);
    } catch (err) {
      console.error(err);
      setScanning(false);
    }
  };

  const handleSubmit = async () => {
    if(!user) return;
    const refId = `BAG-${Math.floor(100000 + Math.random() * 900000)}`;
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'complaints'), {
        refId, type: 'baggage', category: 'loss', location: 'Belt 4', ...formData,
        status: 'searching', priority: 'high', createdAt: serverTimestamp(), lang, userId: user.uid
    });
    navigate('/success', { state: { refId, type: 'baggage' } });
  };

  return (
    <GlassCard className="w-full max-w-lg mx-auto p-8 !bg-black/40">
       <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white">{t.btn_baggage}</h2>
      </div>

      {!extracted ? (
        <div className="space-y-6 animate-fade-in">
          <div 
            onClick={() => document.getElementById('baggage-upload').click()}
            className="group relative h-72 border-2 border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400/60 hover:bg-cyan-400/5 transition-all overflow-hidden"
          >
            {scanning || isUploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <Shield className="text-cyan-400 animate-pulse" />
                  </div>
                </div>
                <span className="mt-4 text-cyan-300 font-mono text-sm tracking-widest">{isUploading ? 'Uploading...' : t.ocr_scan}</span>
                {/* Scanning laser effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,1)] animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            ) : (
              <>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="text-cyan-400 w-8 h-8" />
                </div>
                <span className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">{t.upload_proof}</span>
                <span className="text-sm text-white/40 mt-2">Boarding Pass / Bag Tag</span>
              </>
            )}
            <input 
                type="file" 
                id="baggage-upload" 
                className="hidden" 
                accept="image/*"
                onChange={handleFileUpload}
            />
          </div>
          <button onClick={() => setExtracted(true)} className="w-full py-4 text-white/50 text-sm font-medium hover:text-white transition-colors">
            Enter Manually
          </button>
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in-up">
          <GlassCard className="!bg-green-500/10 !border-green-500/20 p-4 flex items-center gap-3">
             <div className="p-1 bg-green-500 rounded-full"><CheckCircle size={14} className="text-black" /></div>
             <span className="text-green-300 font-medium">{t.ocr_success}</span>
          </GlassCard>

          <div className="space-y-4">
            {['flight', 'tag', 'desc'].map((field) => (
              <div key={field}>
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1 mb-1 block">
                  {field === 'tag' ? 'Tag ID' : field === 'desc' ? 'Description' : t.flight_num}
                </label>
                <GlassInput 
                  value={formData[field]}
                  onChange={e => setFormData({...formData, [field]: e.target.value})}
                  className="font-mono"
                />
              </div>
            ))}
          </div>

          <NeonButton onClick={handleSubmit} className="mt-4">
            Submit Claim
          </NeonButton>
        </div>
      )}
    </GlassCard>
  );
};

export default Baggage;
