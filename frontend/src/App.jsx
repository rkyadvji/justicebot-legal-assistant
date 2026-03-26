import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatFAB from './components/ChatFAB';
import Home from './pages/Home';
import Services from './pages/Services';
import Chatbot from './pages/Chatbot';
import CaseStatus from './pages/CaseStatus';
import { LanguageProvider } from './context/LanguageContext';
import { ChatProvider } from './context/ChatContext';

function AppContent() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chatbot';

  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/chatbot" element={<Chatbot />} />
          <Route path="/case-status" element={<CaseStatus />} />
        </Routes>
      </main>
      {!isChatPage && <Footer />}
      {!isChatPage && <ChatFAB />}
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ChatProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ChatProvider>
    </LanguageProvider>
  );
}
