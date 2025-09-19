require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { auth } = require('express-oauth2-jwt-bearer');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

// ---------- Config from env ----------
const {
  AUTH0_DOMAIN,
  AUTH0_AUDIENCE,
  ENCRYPTION_KEY_BASE64,
  PORT = 3000
} = process.env;

if (!AUTH0_DOMAIN || !AUTH0_AUDIENCE || !ENCRYPTION_KEY_BASE64) {
  console.error('Missing required env vars. See README / .env example.');
  process.exit(1);
}

// decode base64 key (should be 32 bytes for AES-256)
const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_BASE64, 'base64');
if (ENCRYPTION_KEY.length !== 32) {
  console.error('ENCRYPTION_KEY_BASE64 must decode to 32 bytes (AES-256).');
  process.exit(1);
}

// ---------- Auth0 JWT validation middleware ----------
const checkJwt = auth({
  audience: AUTH0_AUDIENCE,
  issuerBaseURL: AUTH0_DOMAIN, // include trailing slash in env as per Auth0 docs, e.g. https://your-domain/
});

// Use checkJwt for any API routes
//app.use('/api', checkJwt);            //put this back in when ready for auth0


// ---------- AES-256-GCM helper functions ----------
// We use format: base64( iv (12 bytes) || ciphertext ) where AES-GCM appends tag
function encryptPayload(plainText) {
  const iv = crypto.randomBytes(12); // recommended 12 bytes for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  // Store as: iv || ciphertext || tag
  const out = Buffer.concat([iv, ciphertext, tag]);
  return out.toString('base64');
}

function decryptPayload(base64Payload) {
  const data = Buffer.from(base64Payload, 'base64');
  if (data.length < 12 + 16) throw new Error('Payload too short');
  const iv = data.slice(0, 12);
  // tag is last 16 bytes
  const tag = data.slice(data.length - 16);
  const ciphertext = data.slice(12, data.length - 16);
  const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString('utf8');
}

// ---------- Example protected route ----------
app.post('/api/data', async (req, res) => {
  try {
    const { payload } = req.body;
    if (!payload) return res.status(400).json({ error: 'Missing payload' });

    // Decrypt incoming payload
    let plaintext;
    try {
      plaintext = decryptPayload(payload);
    } catch (err) {
      console.error('Decryption error:', err.message);
      return res.status(400).json({ error: 'Decryption failed' });
    }

    // Here you have the decrypted data (string). If JSON was sent, parse it.
    let parsed;
    try {
      parsed = JSON.parse(plaintext);
    } catch {
      parsed = plaintext; // not JSON, use raw
    }

    console.log('Authenticated user:', req.auth); // express-oauth2-jwt-bearer exposes req.auth
    console.log('Decrypted request payload:', parsed);

    // Example server-side processing
    const responseData = {
      message: 'Server received your data securely',
      received: parsed,
      timestamp: new Date().toISOString()
    };

    // Encrypt response
    const responsePlain = JSON.stringify(responseData);
    const encryptedResponse = encryptPayload(responsePlain);
    

    return res.json({ payload: encryptedResponse });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// health check - public
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
