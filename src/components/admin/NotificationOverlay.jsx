import React, { useEffect, useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const NotificationOverlay = ({ show, onClose, recipient, type }) => {
  const [step, setStep] = useState('sending'); // sending, sent

  useEffect(() => {
    if (show) {
      setStep('sending');
      const timer = setTimeout(() => {
        setStep('sent');
        setTimeout(() => {
          onClose();
        }, 2000);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
        {step === 'sending' ? (
          <>
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-cyan-500/10 p-4 rounded-full">
                <Mail size={32} className="text-cyan-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sending Notification</h3>
            <p className="text-white/50 text-sm">Connecting to SMTP server...</p>
          </>
        ) : (
          <>
            <div className="bg-green-500/10 p-4 rounded-full mb-4 animate-scale-in">
              <Check size={32} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sent Successfully</h3>
            <p className="text-white/50 text-sm">Email dispatched to {recipient}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationOverlay;
