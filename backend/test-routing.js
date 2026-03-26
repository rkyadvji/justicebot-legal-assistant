const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// We need to alter process.env before requiring the router
// But wait, the router requires dotenv and caches the env immediately.
// We can test the logic directly by making a mock request, but the env was already loaded.

// Another approach: Just load the router normally and see what it does.
// If we want to simulate failure, we can clear the API keys in process.env
// and clear node require cache, then re-require the router.

const testCascade = async () => {
  let router;
  
  const makeRequest = async (appInstance, msg) => {
    return new Promise((resolve, reject) => {
      const http = require('http');
      const server = appInstance.listen(0, () => {
        const port = server.address().port;
        const req = http.request({
          hostname: 'localhost',
          port: port,
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            server.close();
            resolve(JSON.parse(data));
          });
        });
        
        req.on('error', (e) => {
          server.close();
          reject(e);
        });
        
        req.write(JSON.stringify({ message: msg, userId: 'test_user_' + Date.now() }));
        req.end();
      });
    });
  };

  console.log("=== Phase 1: Test with valid Groq ===");
  let app1 = express();
  app1.use(bodyParser.json());
  let chatRouter1 = require('./src/routes/chat.js');
  app1.use('/', chatRouter1);
  const resp1 = await makeRequest(app1, "Can you explain the hierarchy of Indian courts?");
  console.log("Response 1 Source:", resp1.source);

  // Clear require cache for chat.js
  delete require.cache[require.resolve('./src/routes/chat.js')];

  console.log("\\n=== Phase 2: Test with INVALID Groq Key, VALID Gemini ===");
  process.env.GROQ_API_KEY = "invalid_groq_123";
  let app2 = express();
  app2.use(bodyParser.json());
  let chatRouter2 = require('./src/routes/chat.js');
  app2.use('/', chatRouter2);
  const resp2 = await makeRequest(app2, "What are the eligibility criteria to be a Supreme Court judge?");
  console.log("Response 2 Source:", resp2.source);

  delete require.cache[require.resolve('./src/routes/chat.js')];

  console.log("\\n=== Phase 3: Test with INVALID Groq AND INVALID Gemini ===");
  process.env.GROQ_API_KEY = "invalid";
  process.env.GEMINI_API_KEY = "invalid";
  let app3 = express();
  app3.use(bodyParser.json());
  let chatRouter3 = require('./src/routes/chat.js');
  app3.use('/', chatRouter3);
  const resp3 = await makeRequest(app3, "Explain the process of amending the Indian Constitution.");
  console.log("Response 3 Source:", resp3.source);
  console.log("Response 3 Content:", resp3.response);

  // Restore env
  require('dotenv').config();
};

testCascade();
