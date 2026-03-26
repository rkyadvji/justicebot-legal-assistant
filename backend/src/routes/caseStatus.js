const express = require('express');
const router = express.Router();

// Mock case data for demonstration
const mockCases = {
  'DLHC010012342024': {
    cnr: 'DLHC010012342024',
    court: 'Delhi High Court',
    caseType: 'Civil Writ Petition',
    filingDate: '15-03-2024',
    petitioner: 'Rajesh Kumar',
    respondent: 'State of Delhi',
    status: 'Pending',
    nextHearing: '10-04-2026',
    judge: 'Hon. Justice S. K. Sharma',
    stage: 'Arguments',
    orders: [
      { date: '20-01-2026', description: 'Matter adjourned for arguments' },
      { date: '05-12-2025', description: 'Rejoinder filed by petitioner' }
    ]
  },
  'MHHC020034562023': {
    cnr: 'MHHC020034562023',
    court: 'Bombay High Court',
    caseType: 'Criminal Appeal',
    filingDate: '22-06-2023',
    petitioner: 'State of Maharashtra',
    respondent: 'Amit Shah',
    status: 'Reserved for Judgment',
    nextHearing: '28-03-2026',
    judge: 'Hon. Justice P. B. Varale',
    stage: 'Judgment Reserved',
    orders: [
      { date: '15-03-2026', description: 'Judgment reserved after hearing arguments' },
      { date: '01-02-2026', description: 'Final arguments concluded' }
    ]
  },
  'TNDC030056782025': {
    cnr: 'TNDC030056782025',
    court: 'District Court, Chennai',
    caseType: 'Consumer Complaint',
    filingDate: '10-01-2025',
    petitioner: 'Priya Nair',
    respondent: 'ABC Electronics Ltd.',
    status: 'Active',
    nextHearing: '05-04-2026',
    judge: 'Hon. District Judge R. Murugan',
    stage: 'Evidence Recording',
    orders: [
      { date: '10-03-2026', description: 'Witness examination scheduled' }
    ]
  }
};

// GET /api/case-status?cnr=DLHC010012342024
router.get('/', (req, res) => {
  const { cnr } = req.query;

  if (!cnr || cnr.trim().length === 0) {
    return res.status(400).json({ error: 'CNR number is required. Example: DLHC010012342024' });
  }

  const normalizedCnr = cnr.trim().toUpperCase();
  const caseData = mockCases[normalizedCnr];

  if (!caseData) {
    return res.status(404).json({
      error: 'Case not found',
      message: `No case found with CNR: ${normalizedCnr}. Please verify your CNR number or check on ecourts.gov.in.`,
      suggestion: 'Try demo CNRs: DLHC010012342024, MHHC020034562023, TNDC030056782025'
    });
  }

  res.json({ success: true, case: caseData });
});

// POST /api/case-status (alternative)
router.post('/', (req, res) => {
  const { cnr } = req.body;
  if (!cnr) return res.status(400).json({ error: 'CNR number required' });
  req.query.cnr = cnr;
  // Re-use GET logic
  const normalizedCnr = cnr.trim().toUpperCase();
  const caseData = mockCases[normalizedCnr];
  if (!caseData) {
    return res.status(404).json({ error: 'Case not found', suggestion: 'Try: DLHC010012342024' });
  }
  res.json({ success: true, case: caseData });
});

module.exports = router;
