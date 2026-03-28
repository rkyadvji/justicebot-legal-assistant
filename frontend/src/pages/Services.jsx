import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

export default function Services() {
  const { lang } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const isHi = lang === 'hi';

  useEffect(() => {
    axios.get(`/api/services?language=${lang}`)
      .then(r => { setServices(r.data.services); setLoading(false); })
      .catch(() => {
        // fallback static data
        setServices([
          { id: 'ecourts', displayName: isHi ? 'ई-कोर्ट सेवाएं' : 'eCourts Services', displayDescription: isHi ? 'राष्ट्रीय ई-कोर्ट प्लेटफॉर्म के माध्यम से केस की जानकारी प्राप्त करें।' : 'Access case information and judgments online through the National eCourts platform.', icon: '⚖️', url: 'https://ecourts.gov.in', category: 'Court Services' },
          { id: 'telelaw', displayName: isHi ? 'टेली-लॉ सेवाएं' : 'Tele-Law Services', displayDescription: isHi ? 'CSC पर वीडियो कॉन्फ्रेंसिंग के माध्यम से मुफ्त कानूनी सलाह लें।' : 'Get free legal advice from empanelled lawyers via video conferencing at CSCs.', icon: '📞', url: 'https://tele-law.in', category: 'Legal Aid' },
          { id: 'traffic-fine', displayName: isHi ? 'यातायात जुर्माना' : 'Traffic Fine Payment', displayDescription: isHi ? 'वाहन पोर्टल के माध्यम से ऑनलाइन यातायात जुर्माना भरें।' : 'Pay traffic fines online through the Vahan portal quickly and securely.', icon: '🚔', url: 'https://echallan.parivahan.gov.in', category: 'Traffic' },
          { id: 'fasttrack', displayName: isHi ? 'फास्ट ट्रैक कोर्ट' : 'Fast Track Courts', displayDescription: isHi ? 'जघन्य अपराधों के मामलों के त्वरित निपटारे के लिए विशेष कोर्ट।' : 'Special courts for expeditious disposal of heinous crime cases.', icon: '🏛️', url: 'https://doj.gov.in', category: 'Court Services' },
          { id: 'legal-aid', displayName: isHi ? 'कानूनी सहायता (NALSA)' : 'Legal Aid (NALSA)', displayDescription: isHi ? 'वंचित नागरिकों के लिए NALSA द्वारा निःशुल्क कानूनी सेवाएं।' : 'Free legal services for underprivileged citizens through NALSA.', icon: '🤝', url: 'https://nalsa.gov.in', category: 'Legal Aid' },
          { id: 'njdg', displayName: 'NJDG', displayDescription: isHi ? 'जिला और उच्च न्यायालयों में मामलों की लंबितता ट्रैक करें।' : 'Track pendency and disposal of cases across all district and High Courts.', icon: '📊', url: 'https://njdg.ecourts.gov.in', category: 'Data & Analytics' },
        ]);
        setLoading(false);
      });
  }, [lang]);

  return (
    <div className="page-container services-page">
      <div className="page-hero">
        <div className="container">
          <div className="section-tag" style={{ margin: '0 auto 14px' }}>🏛️ {isHi ? 'सेवाएं' : 'Services'}</div>
          <h1>{isHi ? 'न्यायिक सेवाएं' : 'Judicial Services'}</h1>
          <p>{isHi ? 'DoJ द्वारा प्रदान की जाने वाली सभी न्यायिक और कानूनी सेवाएं एक जगह।' : 'All judicial and legal services provided by the Department of Justice, Government of India.'}</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {loading ? (
            <div className="services-grid">
              {Array(6).fill().map((_, i) => (
                <div key={`skel-${i}`} className="service-card skeleton" style={{ height: 210 }}></div>
              ))}
            </div>
          ) : (
            <div className="services-grid">
              {services.map(s => (
                <a key={s.id} className="service-card" href={s.url} target="_blank" rel="noopener noreferrer">
                  <span className="service-icon">{s.icon}</span>
                  <span className="service-tag">{s.category}</span>
                  <h3 className="service-name" style={{ marginTop: 12 }}>{s.displayName}</h3>
                  <p className="service-desc">{s.displayDescription}</p>
                  <div className="service-link">
                    {isHi ? 'पोर्टल पर जाएं' : 'Visit Portal'} ↗
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Legal Info */}
      <section className="section" style={{ background: 'var(--navy-mid)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">📜 {isHi ? 'कानूनी जानकारी' : 'Legal Info'}</div>
            <h2 className="section-title">{isHi ? 'जानें अपने अधिकार' : 'Know Your Rights'}</h2>
            <p className="section-subtitle">{isHi ? 'भारतीय कानून के तहत आपके मूल अधिकारों और कानूनी प्रावधानों की जानकारी।' : 'Information about your fundamental rights and legal provisions under Indian law.'}</p>
          </div>
          <div className="features-grid">
            {[
              { icon: '📜', en: 'Fundamental Rights', hi: 'मौलिक अधिकार', en2: 'Six fundamental rights guaranteed by the Constitution of India.', hi2: 'भारत के संविधान द्वारा गारंटीकृत छह मौलिक अधिकार।' },
              { icon: '🛒', en: 'Consumer Rights', hi: 'उपभोक्ता अधिकार', en2: 'Rights under Consumer Protection Act 2019. File at consumerhelpline.gov.in', hi2: 'उपभोक्ता संरक्षण अधिनियम 2019 के तहत अधिकार।' },
              { icon: '💻', en: 'Cyber Laws', hi: 'साइबर कानून', en2: 'IT Act 2000. Report cyber crime at cybercrime.gov.in.', hi2: 'IT अधिनियम 2000। cybercrime.gov.in पर साइबर अपराध की रिपोर्ट करें।' },
              { icon: '🛡️', en: 'Domestic Violence Protection', hi: 'घरेलू हिंसा से सुरक्षा', en2: 'Protection of Women from Domestic Violence Act 2005. Helpline: 181.', hi2: 'घरेलू हिंसा से महिला संरक्षण अधिनियम 2005। हेल्पलाइन: 181।' },
            ].map((item, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-icon">{item.icon}</div>
                <h3 className="feature-title">{isHi ? item.hi : item.en}</h3>
                <p className="feature-desc">{isHi ? item.hi2 : item.en2}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
