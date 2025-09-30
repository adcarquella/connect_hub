// test-ws-client.ts
const {WebSocket} = require('ws');

const ws = new WebSocket('ws://localhost:3000/ws');

ws.on('open', () => {
  console.log('Connected!');
  ws.send(JSON.stringify({ action: 'subscribe', username: 'test', sitecode: 'SITE123' }));
});

ws.on('message', (msg) => {
  console.log('Received:', msg.toString());
});

ws.on('error', (err) => {
  console.error('WebSocket error', err);
});
