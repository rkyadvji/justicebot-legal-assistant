const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Configure .env
const envPath = path.join(__dirname, '../.env');
dotenv.config({ path: envPath });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Debug logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/chat', require('./routes/chat'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  const fallbackMsg = "I couldn't fetch detailed AI help right now, but here's some guidance on what I can assist with:\n\n• Case Status\n• Traffic Fine\n• Tele-Law Services\n• Free Legal Aid\n\nPlease let me know which of these you need help with. 😊";
  res.status(500).json({ reply: fallbackMsg, response: fallbackMsg, type: "fallback", source: "fallback" });
});

app.listen(PORT, () => {
  console.log(`\n🏛️  JusticeBot Backend`);
  console.log(`📡 Server running at http://localhost:${PORT}`);
});

module.exports = app;
