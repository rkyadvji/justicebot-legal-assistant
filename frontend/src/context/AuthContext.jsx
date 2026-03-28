import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isGuest, setIsGuest] = useState(localStorage.getItem('isGuest') === 'true');
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios defaults
  const apiUrl = import.meta.env.VITE_API_URL || '';
  axios.defaults.baseURL = apiUrl;

  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const loadUser = async () => {
      if (token && !isGuest) {
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data.data.user);
        } catch (err) {
          console.error('Failed to load user:', err);
          logout();
        }
      }
      setIsLoading(false);
    };
    loadUser();
  }, [token, isGuest]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsGuest(false);
    localStorage.setItem('token', userToken);
    localStorage.setItem('isGuest', 'false');
  };

  const signup = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsGuest(false);
    localStorage.setItem('token', userToken);
    localStorage.setItem('isGuest', 'false');
  };

  const continueAsGuest = () => {
    setUser({ name: 'Guest User', email: 'guest@justicebot.in' });
    setIsGuest(true);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.setItem('isGuest', 'true');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    localStorage.removeItem('token');
    localStorage.removeItem('isGuest');
  };

  const updateUser = async (newData) => {
    try {
      const res = await axios.put('/api/auth/update-profile', newData);
      if (res.data.status === 'success') {
        setUser(res.data.data.user);
        return { success: true };
      }
    } catch (err) {
      console.error('Update profile error:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to update profile' 
      };
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isGuest, isLoading, login, signup, continueAsGuest, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
