import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';
import { useChat } from '../context/ChatContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const QUICK_PROMPTS_EN = [
  'How do I check my case status?',
  'What is Tele-Law and how to access it?',
  'How do I pay a traffic fine online?',
  'How to get free legal aid in India?',
  'What are my fundamental rights?',
  'How to file an RTI application?',
];

const QUICK_PROMPTS_HI = [
  'मेरा केस स्टेटस कैसे चेक करूं?',
  'टेली-लॉ क्या है और कैसे उपयोग करें?',
  'ऑनलाइन ट्रैफिक जुर्माना कैसे भरें?',
  'भारत में मुफ्त कानूनी सहायता कैसे पाएं?',
  'मेरे मौलिक अधिकार क्या हैं?',
  'RTI आवेदन कैसे करें?',
];

const SIDEBAR_SERVICES = [
  { icon: '⚖️', label: '/ eCourts', labelHi: 'ई-कोर्ट', url: 'https://ecourts.gov.in' },
  { icon: '📞', label: 'Tele-Law', labelHi: 'टेली-लॉ', url: 'https://tele-law.in' },
  { icon: '🤝', label: 'NALSA Legal Aid', labelHi: 'NALSA सहायता', url: 'https://nalsa.gov.in' },
  { icon: '🚔', label: 'Pay Traffic Fine', labelHi: 'जुर्माना भरें', url: 'https://echallan.parivahan.gov.in' },
  { icon: '📊', label: 'NJDG', labelHi: 'NJDG', url: 'https://njdg.ecourts.gov.in' },
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
    addMessage('user', msgText);
    setIsLoading(true);

    // Build history for context
    const history = messages.map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await axios.post('/api/chat', { message: msgText, history, language: lang });
      addMessage('bot', res.data.response);
    } catch (e) {
      const errorMessage = e.response?.data?.response || (isHi
        ? '❌ क्षमा करें, अभी सर्वर से कनेक्ट नहीं हो पा रहा। कृपया पुनः प्रयास करें।'
        : '❌ Sorry, I could not connect to the server. Please make sure the backend is running and try again.');
      addMessage('bot', errorMessage);
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

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  return (
    <div className="chat-page">
      <div className="chat-layout">
        {/* Sidebar */}
        <aside className="chat-sidebar">
          <p className="sidebar-section-title">{isHi ? 'त्वरित प्रश्न' : 'Quick Prompts'}</p>
          {quickPrompts.slice(0, 4).map((q, i) => (
            <button key={i} className="quick-prompt" onClick={() => sendMessage(q)}>
              💬 {q}
            </button>
          ))}

          <p className="sidebar-section-title" style={{ marginTop: 8 }}>{isHi ? 'सेवाएं' : 'Services'}</p>
          {SIDEBAR_SERVICES.map((s, i) => (
            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="sidebar-service">
              <span>{s.icon}</span>
              <span>{isHi ? s.labelHi : s.label}</span>
              <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)' }}>↗</span>
            </a>
          ))}

          <Link to="/case-status" className="sidebar-service" style={{ marginTop: 4, color: 'var(--saffron)' }}>
            <span>📋</span>
            <span>{isHi ? 'केस स्टेटस' : 'Case Status'}</span>
          </Link>
        </aside>

        {/* Main Chat */}
        <div className="chat-main">
          <div className="chat-header">
            <div className="bot-avatar" style={{ width: 40, height: 40, fontSize: 18 }}>⚖️</div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--white)' }}>JusticeBot</h3>
              <div className="bot-status">
                <div className="status-dot"></div>
                <span style={{ fontSize: 12 }}>{isHi ? 'ऑनलाइन — न्याय सहायक' : 'Online — DoJ Legal Assistant'}</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
              {isHi ? '🇮🇳 भारत सरकार' : '🇮🇳 Govt. of India'}
            </div>
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div className="chat-welcome">
                <div className="welcome-avatar">⚖️</div>
                <h2 className="welcome-title">{isHi ? 'नमस्ते! मैं JusticeBot हूं' : 'Namaste! I\'m JusticeBot'}</h2>
                <p className="welcome-sub">
                  {isHi
                    ? 'मैं भारत के न्याय विभाग का AI सहायक हूं। कानूनी सवाल पूछें, केस स्टेटस जानें, या सेवाओं के बारे में जानकारी लें।'
                    : 'I\'m the AI assistant for India\'s Department of Justice. Ask me about legal rights, case status, judicial services, or any legal guidance you need.'}
                </p>
                <div className="quick-prompts-row">
                  {quickPrompts.map((q, i) => (
                    <button key={i} className="quick-chip" onClick={() => sendMessage(q)}>{q}</button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`message-row ${msg.role}`}>
                  <div className={`msg-avatar ${msg.role}`}>
                    {msg.role === 'bot' ? '⚖️' : '👤'}
                  </div>
                  <div>
                    <div className={`message-bubble ${msg.role}`}>
                      {msg.role === 'bot' ? (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => <p style={{ margin: 0 }}>{children}</p>,
                            strong: ({ children }) => <strong style={{ color: 'var(--saffron)' }}>{children}</strong>,
                            a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#64B5F6' }}>{children}</a>,
                          }}
                        >{msg.content}</ReactMarkdown>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                    <div className="message-time">{formatTime(msg.timestamp)}</div>
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div className="message-row bot">
                <div className="msg-avatar bot">⚖️</div>
                <div className="typing-indicator">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <div className="chat-input-wrapper">
              <textarea
                ref={textareaRef}
                className="chat-input"
                rows={1}
                placeholder={isHi ? 'अपना कानूनी सवाल टाइप करें... (Enter से भेजें)' : 'Type your legal question... (Enter to send)'}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKey}
                disabled={isLoading}
              />
              <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || isLoading} title="Send">
                {isLoading ? <span className="spinner-small"></span> : '➤'}
              </button>
            </div>
            <p className="chat-input-footer">
              {isHi
                ? 'JusticeBot AI सहायता प्रदान करता है। गंभीर कानूनी मामलों के लिए योग्य वकील से परामर्श लें।'
                : 'JusticeBot provides guidance only. For serious legal matters, consult a qualified lawyer.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
