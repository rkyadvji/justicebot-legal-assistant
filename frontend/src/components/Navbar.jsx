import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const t = {
  en: { home: 'Home', services: 'Services', chatbot: 'JusticeBot', caseStatus: 'Case Status', tagline: 'Department of Justice', title: 'DoJ Legal Assistant' },
  hi: { home: 'होम', services: 'सेवाएं', chatbot: 'जस्टिसबॉट', caseStatus: 'केस स्थिति', tagline: 'न्याय मंत्रालय', title: 'DoJ कानूनी सहायक' }
};

export default function Navbar() {
  const { lang, toggle } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const L = t[lang];
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <a className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="nav-emblem">🏛️</div>
          <div className="nav-title-group">
            <span className="nav-title-main">{L.title}</span>
            <span className="nav-title-sub">🇮🇳 {L.tagline} — Govt. of India</span>
          </div>
        </a>

        <ul className="nav-links">
          <li><NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{L.home}</NavLink></li>
          <li><NavLink to="/services" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{L.services}</NavLink></li>
          <li><NavLink to="/case-status" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{L.caseStatus}</NavLink></li>
          <li><NavLink to="/chatbot" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>{L.chatbot}</NavLink></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="lang-toggle">
            <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => lang !== 'en' && toggle()}>EN</button>
            <button className={`lang-btn${lang === 'hi' ? ' active' : ''}`} onClick={() => lang !== 'hi' && toggle()}>हिं</button>
          </div>
          <NavLink to="/chatbot" className="btn btn-primary btn-sm">
            💬 {lang === 'en' ? 'Ask JusticeBot' : 'पूछें'}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
