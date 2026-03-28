import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { useChat } from '../context/ChatContext';
import axios from 'axios';

const QUICK_PROMPTS_EN = [
  'How do I check my case status?',
  'What is Tele-Law and how to access it?',
  'How do I pay a traffic fine online?',
  'How to get free legal aid in India?',
];

const QUICK_PROMPTS_HI = [
  'मेरा केस स्टेटस कैसे चेक करूं?',
  'टेली-लॉ क्या है और कैसे उपयोग करें?',
  'ऑनलाइन ट्रैफिक जुर्माना कैसे भरें?',
  'भारत में मुफ्त कानूनी सहायता कैसे पाएं?',
];

const LEGAL_SERVICES = [
  { name: { en: 'eCourts', hi: 'ई-कोर्ट्स' }, icon: '⚖️', url: 'https://ecourts.gov.in/' },
  { name: { en: 'Tele-Law', hi: 'टेली-लॉ' }, icon: '📞', url: 'https://www.tele-law.in/' },
  { name: { en: 'NALSA Legal Aid', hi: 'NALSA कानूनी सहायता' }, icon: '🤝', url: 'https://nalsa.gov.in/' },
  { name: { en: 'Pay Traffic Fine', hi: 'ट्रैफिक चालान' }, icon: '🚔', url: 'https://echallan.parivahan.gov.in/' },
  { name: { en: 'NJDG', hi: 'NJDG' }, icon: '📊', url: 'https://njdg.ecourts.gov.in/' },
];

function formatTime(date) {
  return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

export default function Chatbot() {
  const { lang } = useLanguage();
  const { messages, isLoading, setIsLoading, addMessage } = useChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const isHi = lang === 'hi';
  const quickPrompts = isHi ? QUICK_PROMPTS_HI : QUICK_PROMPTS_EN;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const msgText = (text || input).trim();
    if (!msgText || isLoading) return;

    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    addMessage('user', msgText);
    setIsLoading(true);

    const history = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await axios.post('/api/chat', { message: msgText, history, language: lang });
      addMessage('bot', res.data.response);
    } catch (e) {
      addMessage('bot', isHi
        ? '❌ क्षमा करें, सर्वर से कनेक्ट नहीं हो पाया। कृपया पुनः प्रयास करें।'
        : '❌ Sorry, could not connect to the server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="cb-layout">
      {/* Sidebar (Web Only - hidden via CSS on mobile) */}
      <aside className="cb-sidebar">
        <div className="cb-sidebar-header">
          <div className="cb-sidebar-brand">
            <div className="cb-sidebar-brand-icon">⚖️</div>
            <span>JusticeBot</span>
          </div>
        </div>

        <div className="cb-sidebar-content">
          {/* Quick Prompts */}
          <div className="cb-sidebar-section">
            <span className="cb-sidebar-title">{isHi ? 'त्वरित संकेत' : 'Quick Prompts'}</span>
            <div className="cb-sidebar-list">
              {quickPrompts.map((q, i) => (
                <button key={i} className="cb-sidebar-item" onClick={() => sendMessage(q)}>
                  <span className="icon">💬</span>
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Legal Services */}
          <div className="cb-sidebar-section">
            <span className="cb-sidebar-title">{isHi ? 'कानूनी सेवाएं' : 'Services'}</span>
            <div className="cb-sidebar-list">
              {LEGAL_SERVICES.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="cb-sidebar-item service">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="icon">{s.icon}</span>
                    <span>{s.name[lang]}</span>
                  </div>
                  <span className="external-icon">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div className="cb-page">
        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-avatar">⚖️</div>
          <div className="cb-header-info">
            <span className="cb-header-name">JusticeBot</span>
            <span className="cb-header-status">
              <span className="cb-status-dot" />
              {isHi ? 'ऑनलाइन' : 'Online'}
            </span>
          </div>
          <div className="cb-header-gov">{isHi ? '🇮🇳 भारत सरकार' : '🇮🇳 Govt. of India'}</div>
        </div>

        {/* Messages Area */}
        <div className="cb-messages-area">
          <div className="cb-messages-inner">
            {messages.length === 0 ? (
              <div className="cb-welcome">
                <div className="cb-welcome-avatar">⚖️</div>
                <h2 className="cb-welcome-title">
                  {isHi ? 'नमस्ते! मैं JusticeBot हूं' : "Namaste! I'm JusticeBot"}
                </h2>
                <p className="cb-welcome-sub">
                  {isHi
                    ? 'भारत के न्याय विभाग का AI सहायक। कानूनी सवाल पूछें या विषय चुनें।'
                    : "AI assistant for India's Department of Justice. Ask a legal question or pick a topic below."}
                </p>
                <div className="cb-chips">
                  {quickPrompts.map((q, i) => (
                    <button key={i} className="cb-chip" onClick={() => sendMessage(q)}>{q}</button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`cb-msg-row ${msg.role}`}>
                    {msg.role === 'bot' && (
                      <div className="cb-msg-avatar bot">⚖️</div>
                    )}
                    <div className="cb-msg-content">
                      <div className={`cb-bubble ${msg.role}`}>
                        {msg.role === 'bot' ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
                              strong: ({ children }) => <strong style={{ color: 'var(--saffron)' }}>{children}</strong>,
                              a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue-light)', textDecoration: 'underline' }}>{children}</a>,
                            }}
                          >{msg.content}</ReactMarkdown>
                        ) : (
                          <p style={{ margin: 0 }}>{msg.content}</p>
                        )}
                      </div>
                      <div className={`cb-time ${msg.role}`}>{formatTime(msg.timestamp)}</div>
                    </div>
                    {msg.role === 'user' && (
                      <div className="cb-msg-avatar user">👤</div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="cb-msg-row bot">
                    <div className="cb-msg-avatar bot">⚖️</div>
                    <div className="cb-msg-content">
                      <div className="cb-bubble bot cb-typing">
                        <span className="cb-dot" />
                        <span className="cb-dot" />
                        <span className="cb-dot" />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="cb-input-area">
          <div className="cb-input-pill">
            <textarea
              ref={textareaRef}
              className="cb-input"
              rows={1}
              placeholder={isHi ? 'अपना प्रश्न लिखें...' : 'Ask your legal question...'}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKey}
              disabled={isLoading}
            />
            <button
              className={`cb-send-btn ${input.trim() && !isLoading ? 'active' : ''}`}
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
            >
              {isLoading ? <span className="spinner-small" /> : '↑'}
            </button>
          </div>
          <p className="cb-footer-note">
            {isHi
              ? 'JusticeBot AI सहायता प्रदान करता है। गंभीर मामलों में वकील से परामर्श लें।'
              : 'JusticeBot provides guidance only. For serious matters, consult a qualified lawyer.'}
          </p>
        </div>
      </div>
    </div>
  );
}
