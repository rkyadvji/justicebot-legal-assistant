import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { 
      label: 'Home', 
      path: '/', 
      icon: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      )
    },
    { 
      label: 'Chat', 
      path: '/chatbot', 
      icon: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
      )
    },
    { 
      label: 'Status', 
      path: '/case-status', 
      icon: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
      )
    },
    { 
      label: 'Profile', 
      path: '/profile', 
      icon: (active) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      )
    }
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="bottom-nav-container">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div 
              key={item.label} 
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="icon-wrapper">
                {item.icon(isActive)}
              </div>
              <span className="nav-label">{item.label}</span>
            </div>
          );
        })}
      </div>

      <style>{`
        .mobile-bottom-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: calc(64px + env(safe-area-inset-bottom));
          background: var(--glass-bg);
          backdrop-filter: blur(25px) saturate(180%);
          -webkit-backdrop-filter: blur(25px) saturate(180%);
          border-top: 1px solid var(--border);
          z-index: 1000;
          display: flex;
          align-items: flex-start;
          padding-top: 8px;
          padding-bottom: env(safe-area-inset-bottom);
        }

        @media (min-width: 769px) {
          .mobile-bottom-nav {
            display: none;
          }
        }

        .bottom-nav-container {
          display: flex;
          width: 100%;
          justify-content: space-around;
          align-items: center;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex: 1;
          padding: 4px 0;
        }

        .nav-item:active {
          transform: scale(0.92);
        }

        .icon-wrapper {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.02em;
          transition: all 0.3s;
        }

        .nav-item.active {
          color: var(--saffron);
        }

        .nav-item.active .icon-wrapper {
          transform: scale(1.1);
          filter: drop-shadow(0 0 10px var(--saffron-glow));
        }

        .nav-item.active .nav-label {
          color: var(--saffron);
        }
      `}</style>
    </nav>
  );
}
