import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatFAB from './components/ChatFAB';
import InstallPrompt from './components/InstallPrompt';
import Home from './pages/Home';
import Services from './pages/Services';
import Chatbot from './pages/Chatbot';
import CaseStatus from './pages/CaseStatus';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './pages/Auth';
import BottomNav from './components/BottomNav';
import Profile from './pages/Profile';

function AppContent() {
  const { user, isGuest, isLoading } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isChatPage = location.pathname === '/chatbot';

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0b1120', color: 'white' }}>
        <p>Initializing JusticeBot...</p>
      </div>
    );
  }

  // Show Auth page if not logged in/guest OR if explicitly at /auth route
  if ((!user && !isGuest) || isAuthPage) {
    return <Auth />;
  }

  return (
    <div className={`app-wrapper${isChatPage ? ' chat-layout-active' : ''}`}>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/case-status" element={<CaseStatus />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
        {!isChatPage && !isAuthPage && <Footer />}
      </main>
      {!isChatPage && !isAuthPage && <ChatFAB />}
      <BottomNav />
      <InstallPrompt />

      <style>{`
        .main-content {
          padding-top: var(--navbar-height);
        }

        .app-wrapper.chat-layout-active .main-content {
          flex: 1;
          overflow: hidden;
        }

        @media (max-width: 768px) {
          .main-content {
            padding-bottom: 80px; /* Space for BottomNav */
          }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <ChatProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </ChatProvider>
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
