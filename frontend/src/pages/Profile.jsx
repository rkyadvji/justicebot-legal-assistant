import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import ThemeToggle from '../components/ThemeToggle';

export default function Profile() {
  const { user, isGuest, logout, updateUser } = useAuth();
  const { lang } = useLanguage();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const isHi = lang === 'hi';

  useEffect(() => {
    if (user?.name) setNewName(user.name);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleSaveName = async () => {
    if (newName === user?.name) { setIsEditing(false); return; }
    if (!newName.trim()) {
      setMessage({ type: 'error', text: isHi ? 'नाम खाली नहीं हो सकता' : 'Name cannot be empty' });
      return;
    }
    setIsSaving(true);
    const result = await updateUser({ name: newName });
    setIsSaving(false);
    if (result.success) {
      setMessage({ type: 'success', text: isHi ? 'नाम अपडेट हो गया! ✅' : 'Name updated! ✅' });
      setIsEditing(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : (isGuest ? 'G' : 'U');

  return (
    <div className="prof-page">
      <div className="prof-container">

        {/* Avatar + Identity */}
        <div className="prof-hero">
          <div className="prof-avatar" style={{ background: isGuest ? 'var(--white-15)' : 'linear-gradient(135deg, var(--saffron), #e65100)' }}>
            {isGuest ? '👤' : initials}
          </div>

          {isEditing ? (
            <div className="prof-name-edit">
              <input
                className="prof-name-input"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                placeholder={isHi ? 'नया नाम' : 'Your name'}
              />
              <div className="prof-edit-actions">
                <button className="prof-btn-save" onClick={handleSaveName} disabled={isSaving}>
                  {isSaving ? '...' : (isHi ? 'सहेजें' : 'Save')}
                </button>
                <button className="prof-btn-cancel" onClick={() => setIsEditing(false)}>
                  {isHi ? 'रद्द' : 'Cancel'}
                </button>
              </div>
            </div>
          ) : (
            <div className="prof-identity">
              <div className="prof-name-row">
                <h1 className="prof-name">
                  {isGuest ? (isHi ? 'अतिथि उपयोगकर्ता' : 'Guest User') : user?.name}
                </h1>
                {!isGuest && (
                  <button className="prof-edit-icon" onClick={() => setIsEditing(true)} title="Edit name">✏️</button>
                )}
              </div>
              {!isGuest && (
                <p className="prof-email">{user?.email}</p>
              )}
              <span className={`prof-badge ${isGuest ? 'guest' : 'verified'}`}>
                {isGuest ? (isHi ? '👤 अतिथि' : '👤 Guest') : (isHi ? '✅ सत्यापित खाता' : '✅ Verified Account')}
              </span>
            </div>
          )}
        </div>

        {/* Feedback message */}
        {message.text && (
          <div className={`prof-message ${message.type}`}>{message.text}</div>
        )}

        {/* Quick Navigation Card */}
        <div className="prof-section-label">{isHi ? 'त्वरित नेविगेशन' : 'Quick Navigation'}</div>
        <div className="prof-card">
          <button onClick={() => navigate('/')} className="prof-card-row" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
            <div className="prof-row-info">
              <span className="prof-row-icon">🏠</span>
              <div>
                <div className="prof-row-label">{isHi ? 'होम' : 'Home'}</div>
                <div className="prof-row-sub">{isHi ? 'मुख्य डैशबोर्ड पर जाएं' : 'Navigate to main dashboard'}</div>
              </div>
            </div>
            <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>›</span>
          </button>
          <div className="prof-card-divider" />
          <button onClick={() => navigate('/chatbot')} className="prof-card-row" style={{ width: '100%', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left' }}>
            <div className="prof-row-info">
              <span className="prof-row-icon">💬</span>
              <div>
                <div className="prof-row-label">{isHi ? 'जस्टिसबॉट' : 'JusticeBot'}</div>
                <div className="prof-row-sub">{isHi ? 'एआई सहायक के साथ चैट करें' : 'Chat with AI assistant'}</div>
              </div>
            </div>
            <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>›</span>
          </button>
        </div>

        {/* Preferences Card */}
        <div className="prof-section-label">{isHi ? 'प्राथमिकताएं' : 'Preferences'}</div>
        <div className="prof-card">
          <div className="prof-card-row">
            <div className="prof-row-info">
              <span className="prof-row-icon">🌐</span>
              <div>
                <div className="prof-row-label">{isHi ? 'भाषा' : 'Language'}</div>
                <div className="prof-row-sub">{lang === 'en' ? 'English' : 'हिंदी'}</div>
              </div>
            </div>
            <LanguageToggle />
          </div>
          <div className="prof-card-divider" />
          <div className="prof-card-row">
            <div className="prof-row-info">
              <span className="prof-row-icon">🎨</span>
              <div>
                <div className="prof-row-label">{isHi ? 'थीम' : 'Appearance'}</div>
                <div className="prof-row-sub">{isHi ? 'लाइट / डार्क मोड' : 'Light / Dark mode'}</div>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>

        {/* Account Card */}
        <div className="prof-section-label">{isHi ? 'खाता' : 'Account'}</div>
        <div className="prof-card">
          {!isGuest && (
            <>
              <div className="prof-card-row">
                <div className="prof-row-info">
                  <span className="prof-row-icon">📧</span>
                  <div>
                    <div className="prof-row-label">{isHi ? 'ईमेल' : 'Email'}</div>
                    <div className="prof-row-sub">{user?.email}</div>
                  </div>
                </div>
              </div>
              <div className="prof-card-divider" />
            </>
          )}
          <div className="prof-card-row">
            <div className="prof-row-info">
              <span className="prof-row-icon">🔖</span>
              <div>
                <div className="prof-row-label">{isHi ? 'खाता स्थिति' : 'Account Status'}</div>
                <div className="prof-row-sub" style={{ color: isGuest ? 'var(--text-muted)' : '#22c55e' }}>
                  {isGuest ? (isHi ? 'अनाम पहुंच' : 'Anonymous access') : (isHi ? 'सत्यापित' : 'Verified')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className="prof-logout-btn" onClick={handleLogout}>
          {isGuest ? (isHi ? '🔐 साइन इन करें' : '🔐 Sign In') : (isHi ? '🚪 साइन आउट' : '🚪 Sign Out')}
        </button>

        <p className="prof-footer-note">
          {isHi ? 'JusticeBot — भारत के न्याय विभाग का AI सहायक' : 'JusticeBot — AI assistant for India\'s Department of Justice'}
        </p>
      </div>
    </div>
  );
}
