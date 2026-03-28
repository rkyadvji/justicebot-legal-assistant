import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  const toggle = () => {
    setLang(l => {
      const next = l === 'en' ? 'hi' : 'en';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggle }}>
      <div className={lang === 'hi' ? 'lang-hi' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
