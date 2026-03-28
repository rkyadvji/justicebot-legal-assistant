import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState(location.state?.mode || 'login'); // 'login' | 'signup'
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, isGuest, login, signup, continueAsGuest } = useAuth();

  // Redirect if already logged in and not explicitly trying to auth
  useEffect(() => {
    if (user && location.pathname === '/auth') {
      navigate('/');
    }
  }, [user, location.pathname, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const response = await fetch(import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}${endpoint}` : endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Something went wrong');

      if (authMode === 'login') {
        login(data.data.user, data.token);
      } else {
        signup(data.data.user, data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b1120',
      padding: '20px',
      color: '#f8fafc'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            background: 'linear-gradient(135deg, #f97316, #fb923c)',
            borderRadius: '16px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            boxShadow: '0 0 20px rgba(249, 115, 22, 0.4)'
          }}>⚖️</div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px' }}>JusticeBot</h1>
          <p style={{ color: '#94a3b8' }}>Legal assistance powered by AI</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {authMode === 'signup' && (
            <input
              type="text"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                padding: '14px 18px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            style={{
              padding: '14px 18px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: '16px',
              outline: 'none'
            }}
          />

          {error && <p style={{ color: '#ef4444', fontSize: '14px', margin: 0 }}>{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #f97316, #fb923c)',
              color: 'white',
              fontWeight: '700',
              border: 'none',
              cursor: 'pointer',
              marginTop: '8px',
              fontSize: '16px',
              transition: 'transform 0.2s',
              opacity: isLoading ? 0.7 : 1
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {isLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ marginTop: '24px', fontSize: '14px', color: '#94a3b8' }}>
          {authMode === 'login' ? (
            <p>Don't have an account? <span 
              onClick={() => setAuthMode('signup')}
              style={{ color: '#f97316', cursor: 'pointer', fontWeight: '600' }}
            >Create one</span></p>
          ) : (
            <p>Already have an account? <span 
              onClick={() => setAuthMode('login')}
              style={{ color: '#f97316', cursor: 'pointer', fontWeight: '600' }}
            >Sign In</span></p>
          )}
        </div>

        <div style={{
          marginTop: '32px',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {isGuest ? (
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#cbd5e1',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%',
                fontWeight: '600',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              Cancel and Return
            </button>
          ) : (
            <button
              onClick={continueAsGuest}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#cbd5e1',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                width: '100%',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
              onMouseOut={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
            >
              Continue as Guest
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
