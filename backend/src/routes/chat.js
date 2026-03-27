const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY && API_KEY !== 'your_gemini_api_key_here' ? new GoogleGenerativeAI(API_KEY) : null;

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = GROQ_API_KEY ? new Groq({ apiKey: GROQ_API_KEY }) : null;

// GEMINI SYSTEM PROMPT
const SYSTEM_PROMPT = `
You are "JusticeBot", an AI legal assistant for the Department of Justice, Government of India 🇮🇳.

Your role is to help users with legal and government-related queries in a clear, simple, and accurate way.

-----------------------------------
🎯 YOUR RESPONSIBILITIES:
-----------------------------------
- Help users with:
  • Case status (eCourts)
  • Traffic fine payment (eChallan)
  • Tele-Law services
  • Free legal aid (NALSA)
  • General legal awareness (PIL, FIR, IPC, courts, rights)

-----------------------------------
📌 RESPONSE RULES:
-----------------------------------
1. Always give structured, in-depth answers. Do NOT give 1-2 line overly short answers for important legal topics.
2. Every significant explanation MUST include: 
   • A clear Definition/Explanation
   • Practical Steps or an Example
3. Keep answers simple and easy to understand.
4. MUST include specific Law references (e.g., IPC, CrPC, POCSO Act) where applicable.
5. MUST provide Practical guidance (where to go, what to file, typical process).
6. NEVER give vague answers like "It depends on many factors". Be specific and insightful in your legal analysis.
7. End naturally and vary your closings (e.g., "Let me know if you want detailed steps.", "I can guide you further if needed.", "Tell me if you want help with your case."). Do NOT repeatedly use identical robotic closings.
8. Answer like a highly intelligent, trustworthy government legal assistant.

-----------------------------------
🚫 STRICT RESTRICTIONS & AMBIGUITY HANDLING:
-----------------------------------
- Do NOT answer unrelated topics (like movies, coding, etc.)
- Do NOT hallucinate or make up laws
- If the question is outside your knowledge base but still legal, explain it with applicable laws.
- **AMBIGUITY & TYPOS**: If the user's input is very short (1-2 words), unclear, or contains obvious typos (e.g., "lower work", "cort"), **DO NOT guess blindly**.
  • Do NOT map to menus (eCourts/Challan) unless specifically asked.
  • Instead, ask for clarification using a bulleted list of 2-3 likely options based on their query or conversation history.
  • *Example:* "I'm not fully sure what you mean. Did you mean:\n• Lawyer (Advocate) work?\n• Lower Court proceedings?\n• Something else?\nPlease clarify."
  • If previous context exists (e.g., discussing a murder/rape case), use that context to suggest the most relevant options (e.g., Lower Court).
- If completely unsure or the topic is unrelated, simply say:
  "I can help with legal and government-related queries. Could you please clarify what you need?"

-----------------------------------
🌐 LANGUAGE RULE:
-----------------------------------
- If user writes in Hindi → reply in Hindi
- If user writes in English → reply in English

-----------------------------------
🧠 CONTEXT:
-----------------------------------
Use the following knowledge when relevant:

- Case Status → https://ecourts.gov.in
- Traffic Fine → https://echallan.parivahan.gov.in
- Legal Aid → NALSA (nalsa.gov.in)
- Tele-Law → Available at CSC centers

-----------------------------------
📌 OUTPUT STYLE:
-----------------------------------
Example:

You can check your case status:

1. Visit: https://ecourts.gov.in  
2. Click on "Case Status"  
3. Enter your 16-digit CNR number  
4. View your case details  

Do you want help with anything else?

-----------------------------------

Now answer the user's query accordingly.
`;

// 📚 LOCAL KNOWLEDGE BASE
const localKnowledgeBase = [
  { keywords: ["rape", "sexual assault", "376"], answer: "Rape cases fall under IPC Section 376.\n\nIf the victim is under 18, the POCSO Act governs the case, which carries much stricter punishments.\n\nBail in such cases:\n• Is rarely and not easily granted.\n• The Court rigidly considers the seriousness of the crime and evidence.\n• It may take days to weeks for a bail hearing.\n\nImmediate police intervention (Dial 112) or consulting a qualified criminal lawyer is strongly advised." },
  { keywords: ["minor", "under 18", "child abuse", "pocso"], answer: "Crimes against anyone under 18 (minors) are strictly dealt with under the POCSO (Protection of Children from Sexual Offences) Act or Juvenile Justice Act.\n\n• Punishments under POCSO are far more severe than standard IPC crimes.\n• Bail is exceptionally difficult and strictly evaluated by special courts.\n• The identity of the minor is legally protected and must never be disclosed.\n\nPlease consult a specialized lawyer or approach your nearest District Legal Services Authority immediately." },
  { keywords: ["pil", "public interest litigation"], answer: "Public Interest Litigation (PIL) allows any citizen to file a case in the Supreme Court or High Court for the protection of public interest." },
  { keywords: ["fir", "first information report", "police complaint"], answer: "An **FIR (First Information Report)** is the initial written document prepared by the police when they receive information about a cognizable offence.\n\n• **Purpose:** It sets the criminal law in motion.\n• **How to file:** Visit the nearest police station and provide a written or oral statement. You have the right to get a free copy of the FIR.\n• **If Police Refuse:** You can send a written complaint to the Superintendent of Police (SP) or file a complaint with a Judicial Magistrate under Section 156(3) CrPC.\n\nLet me know if you want detailed steps on drafting a police complaint." },
  { keywords: ["zero fir"], answer: "A Zero FIR can be filed at any police station, regardless of jurisdiction. It is later transferred to the relevant police station." },
  { keywords: ["e-fir", "efir", "online fir"], answer: "You can file an e-FIR online for vehicle theft or property theft through your state police portal." },
  { keywords: ["420", "ipc 420", "cheating"], answer: "Section 420 of the IPC deals with cheating and dishonestly inducing delivery of property. It is a serious, non-bailable offence." },
  { keywords: ["302", "ipc 302", "murder"], answer: "Section 302 of the IPC prescribes the punishment for murder, which may include the death penalty or life imprisonment. Bail is generally not granted by lower courts." },
  { keywords: ["498a", "ipc 498a", "domestic violence against wife"], answer: "Section 498A of the IPC deals with cruelty by a husband or his relatives towards a married woman." },
  { keywords: ["anticipatory bail", "prevent arrest"], answer: "Anticipatory bail provides protection from arrest in anticipation of being accused of a non-bailable offence (Section 438 CrPC)." },
  { keywords: ["bail", "regular bail"], answer: "Bail is the temporary release of an accused person awaiting trial. The approval time depends on the type of offence (bailable/non-bailable), court workload, and case complexity. Usually it can take from a few hours to a few days." },
  { keywords: ["cyber crime", "online fraud", "internet fraud"], answer: "To report a cyber crime or online fraud using a mobile, dial 1930 immediately or visit the National Cyber Crime Reporting Portal at cybercrime.gov.in." },
  { keywords: ["consumer rights", "consumer forum", "consumer court"], answer: "You can file a complaint with the Consumer Disputes Redressal Commission if a seller gives defective goods or deficient services. The Consumer Protection Act protects your rights." },
  { keywords: ["rti", "right to information"], answer: "The Right to Information (RTI) Act allows citizens to request information from public authorities. You can file an RTI application online at rtionline.gov.in." },
  { keywords: ["legal notice"], answer: "A legal notice is a formal communication sent to a person or entity informing them of an impending legal action. It is often the first step in civil disputes." },
  { keywords: ["divorce", "mutual consent"], answer: "Under the Hindu Marriage Act, spouses can file for divorce by mutual consent if they have been living separately for a year or more and agree to dissolve the marriage." },
  { keywords: ["domestic violence", "pwdva"], answer: "Victims of domestic violence can seek protection, residence orders, and financial relief under the Protection of Women from Domestic Violence Act, 2005." },
  { keywords: ["cheque bounce", "bounced cheque"], answer: "A bounced cheque is a criminal offence under Section 138 of the Negotiable Instruments Act. You must send a legal notice within 30 days of the cheque return." },
  { keywords: ["property dispute", "land dispute"], answer: "Property disputes are civil matters. For a title dispute or eviction, you must file a civil suit in the appropriate civil court." },
  { keywords: ["copyright"], answer: "Copyright protects original literary, dramatic, musical, and artistic works. Registration is not mandatory but highly recommended for legal enforcement." },
  { keywords: ["trademark"], answer: "A trademark protects logos, brand names, and slogans. You can apply for registration at the Controller General of Patents, Designs and Trade Marks (CGPDTM)." },
  { keywords: ["will", "testament"], answer: "A Will is a legal document declaring a person's intention regarding the distribution of their property after death. Registration is optional but advised." },
  { keywords: ["legal heir certificate"], answer: "A Legal Heir Certificate is issued by the Tahsildar to establish the relationship between the deceased and their legal heirs for claiming dues and transferring assets." },
  { keywords: ["succession certificate"], answer: "A Succession Certificate is required from a civil court to claim the movable properties (like bank balances and shares) of a deceased person who did not leave a Will." },
  { keywords: ["pocso", "child abuse"], answer: "The Protection of Children from Sexual Offences (POCSO) Act provides stringent punishments for sexual abuse and exploitation of children below 18 years." },
  { keywords: ["posh", "workplace harassment", "sexual harassment"], answer: "The Prevention of Sexual Harassment (POSH) Act mandates that workplaces with 10 or more employees must form an Internal Complaints Committee (ICC) to handle complaints." },
  { keywords: ["alimony", "maintenance"], answer: "Maintenance can be claimed by a dependent spouse, children, or parents under Section 125 of the CrPC if they are unable to maintain themselves." },
  { keywords: ["motor accident", "mact", "accident claim"], answer: "Victims of road accidents can file for compensation at the Motor Accidents Claims Tribunal (MACT)." },
  { keywords: ["defamation", "defame", "insult"], answer: "Defamation involves harming someone's reputation through false spoken or written statements. It can be a civil or criminal offence in India." },
  { keywords: ["arrest rights", "rights of arrested"], answer: "An arrested person has the right to be informed of grounds of arrest, meet a lawyer, and be produced before a Magistrate within 24 hours." },
  { keywords: ["fundamental rights"], answer: "The Constitution of India guarantees Fundamental Rights, including Equality before Law, Freedom of Speech, Right to Life, and Protection against Discrimination." },
  { keywords: ["affidavit"], answer: "An affidavit is a written statement of facts voluntarily made by an affiant under an oath or affirmation usually administered by a Notary Public or Oath Commissioner." },
  { keywords: ["gst", "goods and services tax"], answer: "Goods and Services Tax (GST) is an indirect tax used in India on the supply of goods and services. It is a comprehensive, multistage, destination-based tax." },
  { keywords: ["police"], answer: "**The Police** are responsible for maintaining law and order, and investigating crimes.\n\n• **For Emergencies:** Dial 112 immediately.\n• **Filing a Complaint:** You can visit your nearest police station to report a crime. For non-cognizable offences, they will record it in the NCR register.\n• **Online Options:** For stolen goods or vehicles, and cyber frauds, you can file an e-FIR through your state's police portal or cybercrime.gov.in.\n\nI can guide you further if needed." },
  { keywords: ["court"], answer: "Courts in India operate under the Supreme Court, High Courts, and District Courts. You can access services for District and Taluka courts at ecourts.gov.in." },
  { keywords: ["case"], answer: "If you have an ongoing case, you can track it on the eCourts platform using your 16-digit CNR number, Party Name, or Case Number." }
];

// IN-MEMORY STATE & RATE LIMITING
const userSessions = {};
const REQUEST_LIMIT = 5;

// 🔍 SMART MATCHING FUNCTION
const getSmartFallback = (message) => {
  const lowerMsg = message.toLowerCase();
  for (const item of localKnowledgeBase) {
    for (const keyword of item.keywords) {
      if (lowerMsg.includes(keyword)) {
        return { answer: item.answer, intent: keyword };
      }
    }
  }
  return null;
};

// 🎯 MAIN ROUTE
router.post('/', async (req, res) => {
  const { message, userId, language = 'en' } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ reply: 'Message is required', response: 'Message is required', source: 'error' });
  }

  const sessionId = userId || req.ip || 'default_user';
  const lowerMsg = message.toLowerCase().trim();

  // Initialize session
  if (!userSessions[sessionId]) {
    userSessions[sessionId] = {
      lastIntent: null,
      geminiCount: 0,
      history: []
    };
  }

  const session = userSessions[sessionId];

  const sendResponse = (reply, source) => {
    if (!reply || typeof reply !== 'string' || !reply.trim()) {
      reply = "⚠️ No response generated. Please try again.";
    }

    // Save interaction to memory to maintain seamless context across Offline & AI
    if (source !== 'error' && source !== 'greeting' && source !== 'closing') {
      session.history.push({ role: 'user', content: message });
      session.history.push({ role: 'assistant', content: reply });
      if (session.history.length > 10) {
        session.history = session.history.slice(-10);
      }
    }

    return res.json({ reply, response: reply, source });
  };

  try {
    // 1️⃣ CONVERSATION CLOSING
    if (/^(thanks|ok|okay|thank you|thx|dhanyawad|shukriya|thanks!|thank you!)$/i.test(lowerMsg)) {
      session.lastIntent = null;
      return sendResponse("You're welcome! 😊 If you need any legal help, feel free to ask anytime.", 'closing');
    }

    // 2️⃣ GREETING DETECTION
    const greetingWords = ['hi', 'hello', 'hey', 'namaste', 'pranam', 'hello!', 'hi!', 'hey!'];
    const firstWord = lowerMsg.split(' ')[0] || lowerMsg;

    if (greetingWords.includes(firstWord.replace(/[^a-z!]/gi, ''))) {
      const greeting = `Hello! I'm JusticeBot 🇮🇳\nYour Department of Justice assistant.\n\nI can help you with:\n1. Case Status (eCourts)\n2. Traffic Fine (eChallan)\n3. Free Legal Aid (NALSA)\n4. Tele-Law (CSC)\n\nHow can I assist you today?`;
      return sendResponse(greeting, 'greeting');
    }

    // YES / NO HANDLING
    if (/^(yes|yeah|yep|yup|haan|ji haan)$/i.test(lowerMsg)) {
      return sendResponse("Please tell me what you need help with (Case Status, Traffic Fine, Tele-Law, or Free Legal Aid).", 'intent');
    }

    if (/^(no|nope|nah|nahi|ji nahi)$/i.test(lowerMsg)) {
      session.lastIntent = null;
      return sendResponse("Alright! Feel free to ask anytime. 😊", 'intent');
    }

    // 3️⃣ CONTEXT-BASED FOLLOW-UP (kitna time lagta hai, fees kitni hai, process kya hai)
    if (/^(kitna time|time|how long|how much time|process kya hai|fees|cost|kitna paisa|what is the process|process)/i.test(lowerMsg)) {
      if (session.lastIntent === 'bail' || session.lastIntent === 'regular bail') {
        const bailTime = "Bail approval time depends on:\n• Type of offence (bailable/non-bailable)\n• Court workload\n• Case complexity\nUsually it can take from a few hours to a few days.";
        return sendResponse(bailTime, 'context');
      }
      if (session.lastIntent === 'case_status') {
        return sendResponse("Checking case status online is instant! Just enter your 16-digit CNR number on ecourts.gov.in.", 'context');
      }
      if (session.lastIntent === 'traffic_fine') {
        return sendResponse("Traffic fines can be paid immediately online. There are mostly no extra convenience fees.", 'context');
      }
      if (session.lastIntent === 'legal_aid' || session.lastIntent === 'tele_law') {
        return sendResponse("These services are provided completely free of cost to eligible citizens by the government.", 'context');
      }
    }

    // 4️⃣ INTENT MATCHING WITH NUMERIC AND CONTEXT MEMORY
    const isVague = /^(ye kaise hoga|how to|process|kya process hai|how|help|steps|guide|what to do|explain|tell me how|kैसे|कैसे करें)$/i.test(lowerMsg);
    let activeIntent = null;

    if (/(case status|ecourts|cnr|^1$)/i.test(lowerMsg)) activeIntent = 'case_status';
    else if (/(traffic fine|echallan|challan details|^2$)/i.test(lowerMsg)) activeIntent = 'traffic_fine';
    else if (/(free legal aid|nalsa|free lawyer|^3$)/i.test(lowerMsg)) activeIntent = 'legal_aid';
    else if (/(tele-law|csc center|video consultation|^4$)/i.test(lowerMsg)) activeIntent = 'tele_law';
    else if (isVague && session.lastIntent) {
      activeIntent = session.lastIntent;
      console.log(`[Memory Triggered] Used context: ${activeIntent} for query: ${lowerMsg}`);
    }

    if (activeIntent) {
      session.lastIntent = activeIntent;
      const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

      if (activeIntent === 'case_status') {
        const variations = [
          `You can easily check your case status online. Here are the steps:\n\n• Visit the eCourts portal: https://ecourts.gov.in\n• Click on "Case Status"\n• Provide your 16-digit CNR number\n• View your case details securely`,
          `Follow these steps to track your case:\n\n• Go to https://ecourts.gov.in\n• Select the "Case Status" option\n• Type in your CNR number\n• Get your up-to-date case information`,
          `Checking your case status takes just a minute:\n\n• Navigate to https://ecourts.gov.in\n• Choose to search by CNR\n• Enter your 16-digit number\n• Hit search and view the details`
        ];
        return sendResponse(pickRandom(variations), 'intent');
      }

      if (activeIntent === 'traffic_fine') {
        const variations = [
          `You can pay your traffic fine online. Here's how:\n\n• Visit: https://echallan.parivahan.gov.in\n• Click "Check Online Services"\n• Enter your Challan Number or Vehicle Number\n• Proceed to pay securely`,
          `Follow these simple steps to clear your traffic challan:\n\n• Go to https://echallan.parivahan.gov.in\n• Open the "Check Online Services" tab\n• Search using your Challan or Vehicle Number\n• Complete your payment`,
          `To resolve your pending traffic fine digitally:\n\n• Access the portal: https://echallan.parivahan.gov.in\n• Click into "Check Online Services"\n• Provide your identifying vehicle/challan number\n• Process your transaction`
        ];
        return sendResponse(pickRandom(variations), 'intent');
      }

      if (activeIntent === 'legal_aid') {
        const variations = [
          `You can get Free Legal Aid through NALSA.\nWomen, children, SC/ST, and low-income citizens are eligible.\n\n• Visit: https://nalsa.gov.in\n• Apply online using their dashboard\n• Or drop by your District Legal Services Authority (DLSA).`,
          `Here is how to secure Free Legal Aid via NALSA:\n\n• Head over to https://nalsa.gov.in\n• Submit an application form online\n• Alternatively, visit your local DLSA office.\n(Note: This is free for eligible groups like SC/ST, women, children, and low-income demographics)`,
          `If you need pro-bono legal support, NALSA provides totally free aid to specific citizens.\n\n• Access the official site: https://nalsa.gov.in\n• Lodge your request virtually\n• Or approach the District Legal Services Authority in person.`
        ];
        return sendResponse(pickRandom(variations), 'intent');
      }

      if (activeIntent === 'tele_law') {
        const variations = [
          `Tele-Law Services provide free pre-litigation advice.\n\n• Locate and visit your nearest Common Service Centre (CSC).\n• Consult with a Panel Lawyer for free via a video link.`,
          `You can connect with remote legal experts using Tele-Law:\n\n• Head to your local Common Service Centre (CSC).\n• They will arrange a free video consultation with a qualified Panel Lawyer.`,
          `Access legal advice quickly through the Tele-Law initiative:\n\n• Find a local CSC (Common Service Centre) in your municipality.\n• Ask them to schedule a free video consultation with a recognized Panel Lawyer.`
        ];
        return sendResponse(pickRandom(variations), 'intent');
      }
    }

    // 5️⃣ SMART FALLBACK (Offline Dictionary BEFORE Gemini)
    const fallbackMatch = getSmartFallback(message);
    if (fallbackMatch) {
      console.log(`[Smart Match] Offline dictionary invoked for ${sessionId}`);
      session.lastIntent = fallbackMatch.intent;
      return sendResponse(fallbackMatch.answer, 'knowledge');
    }

    // 6️⃣ MULTI-PROVIDER AI ROUTING (Groq -> Gemini -> Offline)
    let aiResponse = null;
    let aiSource = null;

    // Try Groq First (PRIMARY)
    if (groq) {
      try {
        const messages = [
          { role: "system", content: SYSTEM_PROMPT },
          ...session.history,
          { role: "user", content: message }
        ];

        const completion = await groq.chat.completions.create({
          messages: messages,
          model: "llama-3.3-70b-versatile", // Currently active Groq model
          temperature: 0.3,
          max_tokens: 500
        });

        const replyText = completion.choices[0]?.message?.content;
        if (replyText && replyText.trim().length > 0) {
          aiResponse = replyText;
          aiSource = 'groq_ai';
          console.log("Groq Success");
        } else {
          throw new Error("Empty response from Groq");
        }
      } catch (groqError) {
        console.log("Groq Failed -> Switching to Gemini");
        console.warn(`[Groq Error Details]: ${groqError.message}`);
      }
    } else {
      console.log("Groq API not configured -> Switching to Gemini");
    }

    // Try Gemini Second (SECONDARY)
    if (!aiResponse && session.geminiCount < REQUEST_LIMIT && genAI) {
      try {
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] }
        });

        const geminiHistory = session.history.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
          history: geminiHistory,
          generationConfig: { maxOutputTokens: 500, temperature: 0.3 }
        });

        const result = await chat.sendMessage(message);

        if (result && result.response && typeof result.response.text === 'function') {
          const replyText = result.response.text();
          if (replyText && replyText.trim().length > 0) {
            aiResponse = replyText;
            aiSource = 'ai';
            session.geminiCount += 1;
            console.log("Gemini Success");
          } else {
            throw new Error("Empty response from Gemini");
          }
        } else {
          throw new Error("Invalid response format from Gemini");
        }
      } catch (geminiError) {
        console.log("Gemini Failed -> Using Offline Response");
        console.warn(`[Gemini Error Details]: ${geminiError.message}`);
      }
    } else if (!aiResponse && (!genAI || session.geminiCount >= REQUEST_LIMIT)) {
      console.log("Gemini Skipped (limit reached or invalid API) -> Using Offline Response");
    }

    // 7️⃣ OFFLINE INTELLIGENCE FALLBACK
    if (aiResponse) {
      return sendResponse(aiResponse, aiSource);
    } else {
      console.log("Offline Mode Activated");

      let offlineResponse = "";

      if (session.lastIntent) {
        offlineResponse += `I'm currently unable to connect to my AI network, but I see you need help with **${session.lastIntent.replace('_', ' ')}**.\n\n`;
        offlineResponse += `Please consult a legal expert or visit your nearest District Legal Services Authority (DLSA) for proper assistance.`;
      } else {
        offlineResponse += `I am currently operating in Offline Mode.\n\n` +
          `If you have a serious legal issue (such as an FIR, Bail, or Criminal case), please approach your local police station (dial 112 for emergencies) or consult a criminal lawyer immediately.\n\n` +
          `For specific government services, you can explicitly ask me about:\n` +
          `• Case Status (eCourts)\n` +
          `• Traffic Fines (eChallan)\n` +
          `• Free Legal Aid (NALSA)`;
      }

      return sendResponse(offlineResponse, 'offline_fallback');
    }

  } catch (error) {
    console.error('❌ Server Route Error:', error.message);
    return sendResponse("⚠️ An internal error occurred. I can still help you with case status or traffic fines.", 'error');
  }
});

module.exports = router;