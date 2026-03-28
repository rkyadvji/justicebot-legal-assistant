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
    <div className="page-container">
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-left" style={{ animation: 'fadeUp 0.8s ease-out' }}>
              <div className="hero-badge">
                <span>🛡️</span>
                <span>{isHi ? 'न्याय विभाग, भारत सरकार' : 'Dept. of Justice, GoI'}</span>
              </div>
              <h1 className="hero-title">
                {isHi ? (
                  <>आपकी <span className="highlight">कानूनी प्रगति</span> के साथ</>
                ) : (
                  <>Empowering your <span className="highlight">Legal Journey</span></>
                )}
              </h1>
              <p className="hero-desc">
                {isHi 
                  ? 'आर्टिफिशियल इंटेलिजेंस के साथ कानूनी सहायता को सरल बनाना। सूचना तक पहुंचें, सेवाओं का लाभ उठाएं और न्याय को अधिक सुलभ बनाएं।'
                  : 'Simplifying legal assistance with AI. Access information, avail services, and make justice more accessible for everyone.'}
              </p>
              <div className="hero-actions">
                <Link to="/chatbot" className="btn btn-primary">
                  {isHi ? 'जस्टिसबॉट से पूछें' : 'Ask JusticeBot'}
                </Link>
                <Link to="/case-status" className="btn btn-secondary">
                  {isHi ? 'केस स्थिति' : 'Case Status'}
                </Link>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-value">24x7</span>
                  <span className="stat-label">{isHi ? 'सहायता' : 'AI Support'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">500+</span>
                  <span className="stat-label">{isHi ? 'कानूनी नियम' : 'Legal Provisions'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">Free</span>
                  <span className="stat-label">{isHi ? 'पहुंच' : 'Accessible'}</span>
                </div>
              </div>
            </div>

            <div className="hero-right hidden-mobile" style={{ animation: 'fadeScale 1s ease-out' }}>
              <div className="hero-card glass">
                <div className="hero-card-header">
                  <div className="bot-avatar">⚖️</div>
                  <div className="bot-info">
                    <h4>JusticeBot</h4>
                    <div className="bot-status">
                      <div className="status-dot"></div>
                      <span>{isHi ? 'ऑनलाइन' : 'Online'}</span>
                    </div>
                  </div>
                </div>
                <div className="hero-messages">
                  <div className="hero-msg bot">
                    {isHi ? 'नमस्ते! मैं आपकी कानूनी सहायता कैसे कर सकता हूँ?' : 'Namaste! How can I assist you with legal information today?'}
                  </div>
                  <div className="hero-msg user">
                    {isHi ? 'मेरा केस स्टेटस कैसे चेक करें?' : 'How do I check my case status?'}
                  </div>
                  <div className="hero-msg bot">
                    {isHi ? 'आप CNR नंबर का उपयोग करके स्टेटस देख सकते हैं।' : 'You can check your status using the CNR number.'}
                  </div>
                </div>
                <div className="hero-input-mock">
                  <span>{isHi ? 'सवाल टाइप करें...' : 'Ask a question...'}</span>
                  <span>➤</span>
                </div>
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

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        .hero-right.hidden-mobile {
          display: flex;
        }
        @media (max-width: 991px) {
          .hero-content { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .hero-left { display: flex; flex-direction: column; align-items: center; }
          .hero-desc { margin-left: auto; margin-right: auto; }
          .hero-actions { justify-content: center; }
          .hero-stats { justify-content: center; }
          .hero-right.hidden-mobile { display: none; }
        }
      `}</style>
    </div>
  );
}
