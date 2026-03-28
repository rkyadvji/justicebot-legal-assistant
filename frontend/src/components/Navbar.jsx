import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';
import ThemeToggle from './ThemeToggle';

const t = {
  en: { 
    pageTitles: {
      '/': 'JusticeBot',
      '/chatbot': 'Legal Assistant',
      '/services': 'Legal Services',
      '/case-status': 'Case Status',
      '/auth': 'Sign In',
      '/profile': 'My Profile'
    },
    settings: {
      language: 'Language',
      theme: 'Appearance',
      light: 'Light',
      dark: 'Dark',
      profile: 'View Profile',
      logout: 'Sign Out',
      login: 'Sign In',
      signup: 'Create Account',
      caseStatus: 'Case Status',
      guest: 'Guest Mode',
      home: 'Home',
      chatbot: 'JusticeBot'
    }
  },
  hi: { 
    pageTitles: {
      '/': 'जस्टिसबॉट',
      '/chatbot': 'कानूनी सहायक',
      '/services': 'कानूनी सेवाएं',
      '/case-status': 'केस स्थिति',
      '/auth': 'साइन इन',
      '/profile': 'मेरी प्रोफाइल'
    },
    settings: {
      language: 'भाषा',
      theme: 'दिखावट',
      light: 'लाइट',
      dark: 'डार्क',
      profile: 'प्रोफ़ाइल देखें',
      logout: 'साइन आउट',
      login: 'साइन इन',
      signup: 'खाता बनाएँ',
      caseStatus: 'केस स्थिति',
      guest: 'अतिथि मोड',
      home: 'होम',
      chatbot: 'जस्टिसबॉट'
    }
  }
};

export default function Navbar() {
  const { lang } = useLanguage();
  const { user, isGuest, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const L = t[lang];
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    return L.pageTitles[path] || L.pageTitles['/'];
  };

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 20px'
      }}>
        {/* Left: Logo */}
        <div style={{ flex: 1 }}>
          <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div className="nav-logo-icon" style={{
              width: scrolled ? '30px' : '36px',
              height: scrolled ? '30px' : '36px',
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: scrolled ? '16px' : '20px',
              boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)',
              transition: 'all 0.3s'
            }}>🏛️</div>
            <span className="nav-brand-text" style={{ 
              fontSize: '18px', 
              fontWeight: '800', 
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em'
            }}>JusticeBot</span>
          </div>
        </div>

        {/* Center: Title */}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <h2 className="nav-page-title" style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            color: 'var(--text-secondary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {getPageTitle()}
          </h2>
        </div>

        {/* Right: Actions */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          
          {/* Desktop Only Toggles (Premium iOS Style) */}
          <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginRight: '24px' }}>
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="navbar-avatar-btn"
              style={{
                width: scrolled ? '36px' : '40px',
                height: scrolled ? '36px' : '40px',
                borderRadius: '50%',
                background: isGuest ? 'var(--white-08)' : 'linear-gradient(135deg, var(--saffron), var(--saffron-light))',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: scrolled ? '14px' : '16px',
                color: 'white',
                transition: 'var(--transition)',
                overflow: 'hidden'
              }}
            >
              {isGuest ? '👤' : (user?.name?.charAt(0).toUpperCase() || 'U')}
            </button>

            {isOpen && (
              <div className="unified-dropdown">
                {/* User Info */}
                <div className="dropdown-user-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', 
                      background: isGuest ? 'var(--white-15)' : 'linear-gradient(135deg, var(--saffron), var(--saffron-light))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
                    }}>
                      {isGuest ? '👤' : (user?.name?.charAt(0).toUpperCase() || 'U')}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: 1.2 }}>
                        {isGuest ? L.settings.guest : user?.name}
                      </div>
                      {!isGuest && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {user?.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dropdown-divider" />

                  {isGuest ? (
                    <>
                      <button onClick={() => handleNav('/')} className="dropdown-item-premium">
                        <span className="dropdown-icon">🏠</span> <span className="dropdown-label">{L.settings.home}</span>
                      </button>
                      <button onClick={() => handleNav('/chatbot')} className="dropdown-item-premium">
                        <span className="dropdown-icon">💬</span> <span className="dropdown-label">{L.settings.chatbot}</span>
                      </button>
                      <div className="dropdown-divider" />
                      <button onClick={() => handleNav('/auth')} className="dropdown-item-premium">
                        <span className="dropdown-icon">🔐</span> <span className="dropdown-label">{L.settings.login}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleNav('/')} className="dropdown-item-premium">
                        <span className="dropdown-icon">🏠</span> <span className="dropdown-label">{L.settings.home}</span>
                      </button>
                      <button onClick={() => handleNav('/chatbot')} className="dropdown-item-premium">
                        <span className="dropdown-icon">💬</span> <span className="dropdown-label">{L.settings.chatbot}</span>
                      </button>
                      <div className="dropdown-divider" />
                      <button onClick={() => handleNav('/profile')} className="dropdown-item-premium">
                        <span className="dropdown-icon">👤</span> <span className="dropdown-label">{L.settings.profile}</span>
                      </button>
                      <button onClick={() => handleNav('/case-status')} className="dropdown-item-premium">
                        <span className="dropdown-icon">⚖️</span> <span className="dropdown-label">{L.settings.caseStatus}</span>
                      </button>
                    </>
                  )}

                {/* Mobile Only Section */}
                <div className="show-mobile">
                  <div className="dropdown-divider" />
                  <div className="dropdown-mobile-toggles">
                    <div className="nav-dropdown-item-group">
                      <span className="nav-dropdown-label">{L.settings.language}</span>
                      <LanguageToggle compact />
                    </div>
                    <div className="nav-dropdown-item-group">
                      <span className="nav-dropdown-label">{L.settings.theme}</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>

                {!isGuest && (
                  <>
                    <div className="dropdown-divider" />
                    <button 
                      onClick={() => { logout(); setIsOpen(false); }} 
                      className="dropdown-item-premium logout"
                    >
                      <span className="dropdown-icon">🚪</span> <span className="dropdown-label">{L.settings.logout}</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile { display: none; }

        /* iOS Segmented Control (Language) */
        .ios-segmented-control {
          background: var(--white-08);
          border-radius: 9px;
          padding: 2px;
          display: flex;
          position: relative;
          width: 90px;
          height: 32px;
          user-select: none;
        }

        .ios-segmented-indicator {
          position: absolute;
          top: 2px;
          left: 2px;
          width: calc(50% - 2px);
          height: calc(100% - 4px);
          background: white;
          border-radius: 7px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.12), 0 3px 1px rgba(0,0,0,0.04);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ios-segmented-control.hi .ios-segmented-indicator {
          transform: translateX(100%);
        }

        .ios-segmented-btn {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
          z-index: 1;
          cursor: pointer;
          transition: color 0.3s;
        }

        .ios-segmented-btn.active {
          color: #111827;
        }

        /* iOS Theme Switch */
        .ios-theme-switch {
          width: 54px;
          height: 30px;
          background: #E9E9EA;
          border-radius: 15px;
          position: relative;
          cursor: pointer;
          transition: background 0.3s;
        }

        .dark .ios-theme-switch {
          background: #34C759; /* Green active state like iOS */
        }

        .ios-theme-knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 26px;
          height: 26px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dark .ios-theme-knob {
          transform: translateX(24px);
        }

        .ios-theme-icon {
          font-size: 15px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-brand-text { display: none; }
          .nav-page-title { font-size: 12px !important; }
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
          
          .unified-dropdown {
            width: 260px;
          }
          
          .dropdown-mobile-toggles {
            padding: 12px 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .nav-dropdown-item-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .nav-dropdown-label {
            font-size: 13px;
            font-weight: 600;
            color: var(--text-secondary);
          }
        }
        
        .dropdown-item-premium.logout {
          color: #ef4444;
        }
        
        .dropdown-item-premium.logout:hover {
          background: rgba(239, 68, 68, 0.05);
        }
      `}</style>
    </nav>
  );
}
