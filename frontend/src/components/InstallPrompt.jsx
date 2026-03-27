import React, { useState, useEffect } from 'react';

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the default browser install prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom UI
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, so clear it
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#1e293b',
      padding: '16px 24px',
      borderRadius: '16px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.5), 0 0 15px rgba(249, 115, 22, 0.2)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      border: '1px solid rgba(249, 115, 22, 0.3)',
      width: '90%',
      maxWidth: '400px',
      animation: 'slideUp 0.5s ease-out'
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
      <div style={{ marginBottom: '12px', textAlign: 'center' }}>
        <h4 style={{ margin: '0 0 4px 0', color: '#fb923c', fontSize: '1.2rem' }}>Install JusticeBot</h4>
        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Add to home screen for a premium app experience.</p>
      </div>
      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
        <button 
          onClick={() => setIsVisible(false)}
          style={{
            flex: 1,
            padding: '10px',
            backgroundColor: 'transparent',
            border: '1px solid #475569',
            color: '#94a3b8',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Later
        </button>
        <button 
          onClick={handleInstallClick}
          style={{
            flex: 2,
            padding: '10px',
            background: 'linear-gradient(135deg, #f97316, #fb923c)',
            border: 'none',
            color: 'white',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(249, 115, 22, 0.3)'
          }}
        >
          Install App
        </button>
      </div>
    </div>
  );
};

export default InstallPrompt;
