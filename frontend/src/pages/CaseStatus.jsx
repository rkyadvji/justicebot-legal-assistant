import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import axios from 'axios';

const DEMO_CNRS = ['DLHC010012342024', 'MHHC020034562023', 'TNDC030056782025'];

function StatusBadge({ status }) {
  const cls = status === 'Pending' ? 'status-pending' : status === 'Active' ? 'status-active' : 'status-reserved';
  return <span className={`case-status-badge ${cls}`}>{status}</span>;
}

export default function CaseStatus() {
  const { lang } = useLanguage();
  const isHi = lang === 'hi';
  const [cnr, setCnr] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!cnr.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const r = await axios.get(`/api/case-status?cnr=${cnr.trim()}`);
      setResult(r.data.case);
    } catch (e) {
      setError(e.response?.data?.message || (isHi ? 'केस नहीं मिला। CNR नंबर जांचें।' : 'Case not found. Please verify your CNR number.'));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === 'Enter' && search();

  return (
    <div className="page-container case-status-page">
      <div className="container" style={{ paddingTop: '24px', paddingBottom: '24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div className="section-tag" style={{ margin: '0 auto 14px' }}>📋</div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: 'var(--white)', marginBottom: 10 }}>
            {isHi ? 'केस स्टेटस चेक करें' : 'Case Status Check'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
            {isHi ? 'अपना CNR नंबर दर्ज करें और अपनी केस स्थिति तुरंत देखें।' : 'Enter your CNR number to instantly check the status of your court case.'}
          </p>
        </div>

        <div className="case-search-box glass">
          <h2>🔍 {isHi ? 'CNR नंबर दर्ज करें' : 'Enter CNR Number'}</h2>
          <p>{isHi ? 'CNR नंबर 16 अंकों का होता है जैसे: DLHC010012342024' : 'CNR number is 16 characters. Example: DLHC010012342024'}</p>
          <div className="search-row">
            <input
              className="input-field"
              placeholder={isHi ? 'जैसे: DLHC010012342024' : 'e.g. DLHC010012342024'}
              value={cnr}
              onChange={e => setCnr(e.target.value.toUpperCase())}
              onKeyDown={handleKey}
              maxLength={20}
            />
            <button className="btn btn-primary" onClick={search} disabled={loading}>
              {loading ? <span className="spinner"></span> : '🔍'} {isHi ? 'खोजें' : 'Search'}
            </button>
          </div>
          <div style={{ marginTop: 14 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              {isHi ? 'डेमो CNR नंबर आज़माएं:' : 'Try demo CNRs:'}
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {DEMO_CNRS.map(c => (
                <button key={c} className="quick-chip" onClick={() => { setCnr(c); }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ maxWidth: 640, margin: '0 auto 24px', padding: '16px 20px', background: 'rgba(244,67,54,0.1)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 'var(--radius-md)', color: '#EF9A9A', fontSize: 14 }}>
            ❌ {error}
          </div>
        )}

        {loading && !result && !error && (
          <div className="case-result glass skeleton skeleton-box" style={{ height: 300 }}></div>
        )}

        {result && (
          <div className="case-result glass">
            <div className="case-result-header">
              <div>
                <h3 className="case-title">{result.caseType}</h3>
                <p className="case-cnr">CNR: {result.cnr} · {result.court}</p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            {result.nextHearing && (
              <div className="case-next-hearing">
                <span style={{ fontSize: 24 }}>📅</span>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{isHi ? 'अगली सुनवाई' : 'Next Hearing Date'}</p>
                  <p className="next-date">{result.nextHearing}</p>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{isHi ? 'चरण' : 'Stage'}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--white)' }}>{result.stage}</p>
                </div>
              </div>
            )}

            <div className="case-grid">
              <div className="case-field">
                <div className="case-field-label">{isHi ? 'याचिकाकर्ता' : 'Petitioner'}</div>
                <div className="case-field-value">{result.petitioner}</div>
              </div>
              <div className="case-field">
                <div className="case-field-label">{isHi ? 'प्रतिवादी' : 'Respondent'}</div>
                <div className="case-field-value">{result.respondent}</div>
              </div>
              <div className="case-field">
                <div className="case-field-label">{isHi ? 'न्यायाधीश' : 'Judge'}</div>
                <div className="case-field-value">{result.judge}</div>
              </div>
              <div className="case-field">
                <div className="case-field-label">{isHi ? 'दाखिल तिथि' : 'Filing Date'}</div>
                <div className="case-field-value">{result.filingDate}</div>
              </div>
            </div>

            {result.orders?.length > 0 && (
              <div className="orders-section">
                <h4>📄 {isHi ? 'हालिया आदेश' : 'Recent Orders'}</h4>
                {result.orders.map((o, i) => (
                  <div key={i} className="order-item">
                    <span className="order-date">{o.date}</span>
                    <span className="order-desc">{o.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
