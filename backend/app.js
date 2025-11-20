require('dotenv').config();
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
const { getDashboardSummary } = require('./routes/dashboard/dashboardSummary');
const { getCallData } = require('./routes/call_data/calldata');
const { setupWebSocketServer } = require('./websockets/websocket');
const { user_config } = require('./routes/user/user_config');
const { dashboard_get_data } = require('./routes/sense/dashboard/getData');
const {sense_get_settings} = require("./routes/sense/configuration/getSettings");

const app = express();

// Middleware
app.use(bodyParser.json({ limit: '1mb' }));
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  //origin: "https://connect.arquella.co.uk" || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Example AES helpers
const { ENCRYPTION_KEY_BASE64 } = process.env;
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_BASE64, 'base64');

function encryptPayload(plainText) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, ciphertext, tag]).toString('base64');
}

function decryptPayload(base64Payload) {
  const data = Buffer.from(base64Payload, 'base64');
  const iv = data.slice(0, 12);
  const tag = data.slice(data.length - 16);
  const ciphertext = data.slice(12, data.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

// Routes
app.get("/api/hello", (req, res) => res.json({ message: "Hello World" }));


//-------------DASHBOARD------------------//
app.post("/api/dashboard/summary", getDashboardSummary);


//-------------CALL------------------//
app.post("/api/call/getdata", getCallData);


//-------------USER------------------//
//endpoint to get the user
app.post("/api/user/config", user_config);


//-------------SENSE------------------//
//endpoint to getsense dash data
app.post("/api/sense/dashboard/data/get", dashboard_get_data);
//endpoint to get the sense data for a room or device
//app.post("/api/site/config/get", user_config);


//-------------CONFIG------------------//
//endpoint to get the list of rooms or devices
app.post("/api/site/config/get", user_config);
//endpoint to return the config for a site.
//app.post("/api/user/config", user_config);
//endpoint to add in a sense device.

//get sense settings
app.post("/api/device/sense/config/", sense_get_settings);


app.post("/api/data", (req, res) => {
  try {
    const { payload } = req.body;
    if (!payload) return res.status(400).json({ error: "Missing payload" });
    const plaintext = decryptPayload(payload);
    const parsed = JSON.parse(plaintext);
    const responsePlain = JSON.stringify({ received: parsed });
    const encryptedResponse = encryptPayload(responsePlain);
    res.json({ payload: encryptedResponse });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create HTTP server and attach WebSocket
const server = http.createServer(app);
setupWebSocketServer(server);

// Start server
const PORT = process.env.PORT || 8189;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, encryptPayload, decryptPayload };
