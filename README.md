# DoJ Legal Assistant — AI-Powered Legal Portal

[![Government of India](https://img.shields.io/badge/Government%20of%20India-DoJ-saddlebrown)](https://doj.gov.in)
[![React](https://img.shields.io/badge/Frontend-React%2BVite-blue)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%2BExpress-green)](https://nodejs.org)
[![Groq AI](https://img.shields.io/badge/AI-Groq%20Llama%203-orange)](https://groq.com)
[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini-blue)](https://ai.google.dev)

An AI-powered legal assistant web application for the **Department of Justice, Ministry of Law & Justice, Government of India**. Citizens can interact with an intelligent chatbot (JusticeBot) to get guidance on judicial services, case status, legal aid, Tele-Law, and more.

---

## 🗂️ Project Structure

```
doj-legal-assistant/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── chat.js          # POST /api/chat (Groq -> Gemini -> Offline Cascade)
│   │   │   ├── caseStatus.js    # GET  /api/case-status
│   │   │   ├── services.js      # GET  /api/services
│   │   │   └── legalInfo.js     # GET  /api/legal-info
│   │   ├── data/
│   │   │   └── knowledgeBase.json  # DoJ services, FAQs, legal info
│   │   └── server.js
│   ├── .env
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Services.jsx
    │   │   ├── Chatbot.jsx       # Full chat UI with AI
    │   │   └── CaseStatus.jsx    # CNR case lookup
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── ChatFAB.jsx
    │   ├── context/
    │   │   ├── LanguageContext.jsx  # EN/HI toggle
    │   │   └── ChatContext.jsx      # Chat state
    │   ├── App.jsx
    │   └── index.css             # Full design system
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ installed

### 1. Start the Backend

```bash
cd backend

# Ensure your local environment is configured
# Create or edit backend/.env and add:
# GROQ_API_KEY=your_groq_key_here
# GEMINI_API_KEY=your_gemini_key_here

npm install   # Install dependencies (including groq-sdk)
npm start
# Server starts at http://localhost:5000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
# App starts at http://localhost:5173
```

### 3. Open the App

🌐 **http://localhost:5173**

---

## 🔑 AI Cascade Setup (Groq & Gemini)

The application utilizes a robust **Multi-Provider AI Fallback System** to ensure 100% uptime even during API outages:

1. **Primary AI (Groq):** Powered by the lightning-fast `llama-3.3-70b-versatile` model. Get a free key at [console.groq.com](https://console.groq.com).
2. **Secondary AI (Gemini):** Automatically jumps to Gemini if Groq fails or rate-limits. Get a free key at [aistudio.google.com](https://aistudio.google.com/apikey).
3. **Offline Mode:** If both APIs fail, the app relies on a vast, hardcoded local dictionary for essential legal guidance.

To configure:
1. Open `backend/.env`
2. Add your keys:
   ```env
   GROQ_API_KEY=your_groq_key
   GEMINI_API_KEY=your_gemini_key
   ```
3. Restart the backend server. The app works perfectly fine without keys by defaulting immediately to Offline Mode.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| POST | `/api/chat` | AI chatbot (body: `{message, history, language}`) |
| GET | `/api/case-status?cnr=DLHC010012342024` | Case status by CNR |
| GET | `/api/services?language=hi` | List all DoJ services |
| GET | `/api/legal-info` | Legal information articles |

### Demo CNR Numbers (for testing)
- `DLHC010012342024` — Delhi High Court (Pending)
- `MHHC020034562023` — Bombay High Court (Reserved for Judgment)
- `TNDC030056782025` — District Court, Chennai (Active)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite 5 |
| Routing | React Router DOM v6 |
| Backend | Node.js + Express v4 |
| AI | Groq (Llama 3.3) + Google Gemini 1.5 (Fallback) |
| HTTP Client | Axios |
| Markdown | react-markdown |
| Styling | Vanilla CSS (glassmorphism, CSS variables) |
| Fonts | Inter + Noto Sans Devanagari |

---

## ✨ Features

- 🤖 **JusticeBot AI** — Conversational agent powered by Groq & Gemini with deep context tracking
- ⚖️ **Case Status** — Real-time case lookup by CNR number
- 🏛️ **Services Portal** — All DoJ services (eCourts, Tele-Law, NALSA, Traffic Fines)
- 🌐 **Bilingual** — English & Hindi (हिंदी) support
- 💬 **Multi-turn Chat** — Context-aware AI that remembers earlier logic in the conversation
- 🛡️ **Offline Resiliency** — Contains built-in hardcoded legal templates to survive total network outages
- 📱 **Responsive** — Mobile-friendly design
- 🎨 **Premium UI** — Dark navy/saffron theme with glassmorphism effects

---

## 🚀 Deployment (Netlify & Render)

### 1. Backend Hosting (Render or Railway)
Since the backend is an Express Node.js application, it requires a Node.js runtime environment (Netlify strictly hosts static sites or serverless functions out of the box).
1. Push this repository to GitHub.
2. Go to [Render.com](https://render.com) and create a new **Web Service**.
3. Point it to your repo and set the **Root Directory** to `backend`.
4. Set the Start Command to `npm start`.
5. Enter your `GROQ_API_KEY` and `GEMINI_API_KEY` into Render's Environment Variables panel.
6. Deploy and copy your new secure backend URL (e.g., `https://backend-xyz.onrender.com`).

### 2. Frontend Hosting (Netlify)
Netlify perfectly hosts the Vite frontend!
1. In your frontend repository, ensure the frontend API requests point to your deployed backend URL instead of localhost. (Tip: Update `http://localhost:5000` to your new Render Backend URL).
2. Connect your GitHub repository to [Netlify.com](https://netlify.com).
3. Set your **Base directory** to `frontend`.
4. Set **Build command** to `npm run build`.
5. Set **Publish directory** to `frontend/dist`.
6. Click **Deploy Site**! Your frontend will now go live and communicate securely with your hosted backend.
