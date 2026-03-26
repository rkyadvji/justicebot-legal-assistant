export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span>🏛️</span> DoJ Legal Assistant
            </div>
            <p className="footer-desc">
              An AI-powered legal assistant portal by the Department of Justice, Ministry of Law and Justice, Government of India. Empowering citizens with accessible legal information and services.
            </p>
            <div className="tricolor"></div>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="https://doj.gov.in" target="_blank" rel="noopener noreferrer">doj.gov.in</a></li>
              <li><a href="https://ecourts.gov.in" target="_blank" rel="noopener noreferrer">eCourts Portal</a></li>
              <li><a href="https://tele-law.in" target="_blank" rel="noopener noreferrer">Tele-Law</a></li>
              <li><a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer">NALSA</a></li>
              <li><a href="https://njdg.ecourts.gov.in" target="_blank" rel="noopener noreferrer">NJDG</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Helplines</h4>
            <ul className="footer-links">
              <li><a href="#">Legal Aid: 15100</a></li>
              <li><a href="#">Women Helpline: 181</a></li>
              <li><a href="#">Cyber Crime: 1930</a></li>
              <li><a href="#">Consumer: 1800-11-4000</a></li>
              <li><a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer">RTI Online Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {year} JusticeBot. All rights reserved. Built by Raushan Kumar Yadav</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            ⚠️ This is a demonstration application. For legal advice, consult a qualified lawyer.
          </p>
        </div>
      </div>
    </footer>
  );
}
