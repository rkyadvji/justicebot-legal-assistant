import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const features = [
  { icon: '🤖', en: { title: 'AI-Powered Chatbot', desc: 'Get instant answers to legal queries using our LLM-powered JusticeBot.' }, hi: { title: 'AI चैटबॉट', desc: 'हमारे AI-संचालित JusticeBot से तुरंत कानूनी सवालों के जवाब पाएं।' } },
  { icon: '📋', en: { title: 'Case Status Tracking', desc: 'Check the status of any court case instantly using your CNR number.' }, hi: { title: 'केस स्टेटस ट्रैकिंग', desc: 'अपने CNR नंबर से किसी भी न्यायालय के मामले की स्थिति तुरंत जांचें।' } },
  { icon: '📞', en: { title: 'Tele-Law Services', desc: 'Connect with empanelled lawyers via video call at your nearest CSC.' }, hi: { title: 'टेली-लॉ सेवाएं', desc: 'अपने नजदीकी CSC पर वीडियो कॉल के माध्यम से वकीलों से जुड़ें।' } },
  { icon: '🌐', en: { title: 'Multilingual Support', desc: 'Access all services in English and Hindi for wider reach.' }, hi: { title: 'बहुभाषी समर्थन', desc: 'व्यापक पहुंच के लिए अंग्रेजी और हिंदी में सभी सेवाओं तक पहुंचें।' } },
];

const services = [
  { icon: '⚖️', id: 'ecourts', en: { name: 'eCourts Services', desc: 'Case information & judgments' }, hi: { name: 'ई-कोर्ट सेवाएं', desc: 'केस जानकारी और निर्णय' } },
  { icon: '🤝', id: 'telelaw', en: { name: 'Legal Aid (NALSA)', desc: 'Free legal assistance' }, hi: { name: 'कानूनी सहायता', desc: 'निःशुल्क कानूनी सहायता' } },
  { icon: '🚔', id: 'traffic', en: { name: 'Traffic Fines', desc: 'Pay challans online' }, hi: { name: 'यातायात जुर्माना', desc: 'ऑनलाइन चालान भरें' } },
  { icon: '📋', id: 'rti', en: { name: 'RTI Portal', desc: 'Right to Information' }, hi: { name: 'RTI पोर्टल', desc: 'सूचना का अधिकार' } },
];

export default function Home() {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container hero-content">
          <div className="hero-text">
            <div className="hero-badge">🇮🇳 {isHi ? 'भारत सरकार' : 'Government of India'}</div>
            <h1 className="hero-title">
              {isHi ? (
                <><span className="highlight">AI-powered</span><br />कानूनी सहायक</>
              ) : (
                <>Your <span className="highlight">AI-Powered</span><br />Legal Assistant</>
              )}
            </h1>
            <p className="hero-desc">
              {isHi
                ? 'न्याय विभाग, भारत सरकार द्वारा संचालित। केस स्थिति, टेली-लॉ, कानूनी सहायता और न्यायिक सेवाओं के लिए तुरंत मार्गदर्शन पाएं।'
                : 'Powered by the Department of Justice, Government of India. Get instant guidance on case status, Tele-Law, legal aid, and judicial services — in your language.'}
            </p>
            <div className="hero-actions">
              <Link to="/chatbot" className="btn btn-primary">💬 {isHi ? 'JusticeBot से पूछें' : 'Ask JusticeBot'}</Link>
              <Link to="/services" className="btn btn-secondary">🏛️ {isHi ? 'सेवाएं देखें' : 'Explore Services'}</Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item"><span className="stat-value">25,000+</span><span className="stat-label">{isHi ? 'न्यायालय' : 'Courts'}</span></div>
              <div className="stat-item"><span className="stat-value">4.5 Cr+</span><span className="stat-label">{isHi ? 'लंबित मामले' : 'Pending Cases'}</span></div>
              <div className="stat-item"><span className="stat-value">4.5L+</span><span className="stat-label">{isHi ? 'टेली-लॉ सत्र' : 'Tele-Law Sessions'}</span></div>
            </div>
          </div>

          {/* Hero demo card */}
          <div className="hero-visual">
            <div className="hero-card glass float">
              <div className="hero-card-header">
                <div className="bot-avatar">⚖️</div>
                <div className="bot-info">
                  <h4>JusticeBot</h4>
                  <div className="bot-status"><div className="status-dot"></div> Online</div>
                </div>
              </div>
              <div className="hero-messages">
                <div className="hero-msg bot" style={{ animationDelay: '0.2s' }}>
                  {isHi ? '🙏 नमस्ते! मैं JusticeBot हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?' : '🙏 Namaste! I\'m JusticeBot. How can I assist you today?'}
                </div>
                <div className="hero-msg user" style={{ animationDelay: '0.4s' }}>
                  {isHi ? 'मेरा केस स्टेटस कैसे चेक करूं?' : 'How do I check my case status?'}
                </div>
                <div className="hero-msg bot" style={{ animationDelay: '0.6s' }}>
                  {isHi ? '✅ अपने CNR नंबर से ecourts.gov.in पर जाएं या यहाँ Case Status सेक्शन में चेक करें।' : '✅ Use your CNR number on ecourts.gov.in or check instantly in the Case Status section here!'}
                </div>
              </div>
              <div className="hero-input-mock">
                <span>{isHi ? 'अपना सवाल टाइप करें...' : 'Type your legal question...'}</span>
                <span style={{ fontSize: 18 }}>📤</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section" style={{ background: 'var(--navy-mid)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">✨ {isHi ? 'विशेषताएं' : 'Features'}</div>
            <h2 className="section-title">{isHi ? 'न्याय तक आसान पहुंच' : 'Justice Made Accessible'}</h2>
            <p className="section-subtitle">{isHi ? 'सभी न्यायिक सेवाएं एक जगह, आपकी भाषा में।' : 'All judicial services in one place, available in your language.'}</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i} style={{ animation: `fadeSlideIn 0.4s ${0.1 * i}s ease both` }}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{isHi ? f.hi.title : f.en.title}</h3>
                <p className="feature-desc">{isHi ? f.hi.desc : f.en.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🏛️ {isHi ? 'सेवाएं' : 'Services'}</div>
            <h2 className="section-title">{isHi ? 'लोकप्रिय सेवाएं' : 'Popular Services'}</h2>
          </div>
          <div className="services-grid">
            {services.map((s) => (
              <Link to="/services" key={s.id} className="service-card">
                <span className="service-icon">{s.icon}</span>
                <h3 className="service-name">{isHi ? s.hi.name : s.en.name}</h3>
                <p className="service-desc">{isHi ? s.hi.desc : s.en.desc}</p>
                <div className="service-link">
                  {isHi ? 'और जानें' : 'Learn more'} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section" style={{ background: 'var(--navy-mid)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-tag" style={{ margin: '0 auto 16px' }}>💬 JusticeBot</div>
          <h2 className="section-title">{isHi ? 'अभी JusticeBot से पूछें' : 'Have a Legal Question?'}</h2>
          <p className="section-subtitle" style={{ marginBottom: 32 }}>
            {isHi ? 'हमारा AI-सहायक 24/7 आपके कानूनी सवालों के जवाब देने के लिए तैयार है।' : 'Our AI assistant is available 24/7 to guide you through Indian legal services and your rights.'}
          </p>
          <Link to="/chatbot" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px' }}>
            🚀 {isHi ? 'अभी शुरू करें' : 'Start Chatting Now'}
          </Link>
        </div>
      </section>
    </>
  );
}
