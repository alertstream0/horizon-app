import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';
import { translations } from '../utils/translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [lang, setLang] = useState('fr'); // Default to FR per request

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
        if (u) {
            setUser(u);
        } else {
            // Auto-sign in anonymously for passengers
            signInAnonymously(auth).catch(e => console.error("Anon Auth Failed:", e));
        }
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const t = translations[lang];
  const isRTL = lang === 'ar';

  const value = {
    user,
    lang,
    setLang,
    t,
    isRTL,
    logout
  };

  return (
    <AppContext.Provider value={value}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'rtl' : 'ltr'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
