const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
let chatRouter = require('./src/routes/chat.js');
app.use('/', chatRouter);

const userId = 'context_user_' + Date.now();

const testContext = async () => {
  const http = require('http');
  const server = app.listen(0, async () => {
    const port = server.address().port;
    
    const sendMsg = (msg) => new Promise((resolve, reject) => {
      const req = http.request({
        hostname: 'localhost',
        port,
        path: '/',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }, (res) => {
        let data = '';
        res.on('data', c => data += c);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.write(JSON.stringify({ message: msg, userId }));
      req.end();
    });

    console.log("=== Query 1: What are the laws for a minor? ===");
    const res1 = await sendMsg("What are the laws for a minor?");
    console.log("Source:", res1.source);
    console.log("Response:\\n" + res1.response, "\\n\\n");

    console.log("=== Query 2: And how long is the bail time for that? ===");
    const res2 = await sendMsg("And how long is the bail time for that?");
    console.log("Source:", res2.source);
    console.log("Response:\\n" + res2.response, "\\n\\n");

    console.log("=== Query 3: What about a murder scenario? ===");
    const res3 = await sendMsg("What about a murder scenario?");
    console.log("Source:", res3.source);
    console.log("Response:\\n" + res3.response, "\\n\\n");

    server.close();
  });
};

testContext();
