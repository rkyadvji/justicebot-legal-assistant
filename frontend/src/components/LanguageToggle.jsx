import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle({ compact = false }) {
  const { lang, toggle } = useLanguage();

  return (
    <div className={`ios-segmented-control ${lang} ${compact ? 'compact' : ''}`}>
      <div className="ios-segmented-indicator" />
      <button 
        onClick={() => lang !== 'en' && toggle()} 
        className={`ios-segmented-btn ${lang === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button 
        onClick={() => lang !== 'hi' && toggle()} 
        className={`ios-segmented-btn ${lang === 'hi' ? 'active' : ''}`}
      >
        HI
      </button>
    </div>
  );
}
