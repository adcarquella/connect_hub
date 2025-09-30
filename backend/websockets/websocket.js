const WebSocket = require('ws');
const { getDatabaseRef } = require("../data/Firebase");
const siteSubscribers = {};


function listenToSiteUpdates(sitecode, callback) {
  console.log(`Listening to Firebase for sitecode: ${sitecode}`);
  const siteObject = {

    liveCalls: {},
    feed: []

  }

  const ref = getDatabaseRef(
    "https://arquella-cc76e-afe91.europe-west1.firebasedatabase.app",
    `sensetestPhoneLiveCalls` // dynamic path per sitecode
  );

  const listener = (snapshot) => {
    const data = snapshot.val();
    
    if (data) {
        siteObject.liveCalls = data;
      callback({ sitecode, update: siteObject }); // send real Firebase data
    }
    else {
        siteObject.liveCalls = {};
    }
    console.log(siteObject);
  };

  ref.on("value", listener);

  // Return unsubscribe function
  return () => ref.off("value", listener);
}

    /*
    function listenToSiteUpdates(sitecode, callback) {
      console.log(`Listening for updates for sitecode: ${sitecode}`);
    
      const interval = setInterval(() => {
        callback({ sitecode, update: `Update at ${new Date().toISOString()}` });
      }, 5000);
    
      return () => clearInterval(interval); // unsubscribe
    }*/

    function setupWebSocketServer(server) {
        const wss = new WebSocket.Server({ server, path: '/ws' });

        wss.on('connection', (ws) => {
            console.log('Client connected via WebSocket');
            let subscribedSitecode = null;

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    const { action, sitecode } = data;
                    console.log('Received:', data);

                    if (action === 'subscribe') {
                        subscribedSitecode = sitecode;

                        if (!siteSubscribers[sitecode]) {
                            siteSubscribers[sitecode] = { users: new Set(), unsubscribeFn: null };

                            // Start listener for this sitecode
                            siteSubscribers[sitecode].unsubscribeFn = listenToSiteUpdates(sitecode, (update) => {
                                siteSubscribers[sitecode].users.forEach(client => {
                                    if (client.readyState === WebSocket.OPEN) {
                                        client.send(JSON.stringify(update));
                                    }
                                });
                            });
                        }

                        // Add this client to the set
                        siteSubscribers[sitecode].users.add(ws);

                        ws.send(JSON.stringify({ message: `Subscribed to ${sitecode}` }));
                    }

                    if (action === 'unsubscribe') {
                        if (siteSubscribers[sitecode]) {
                            siteSubscribers[sitecode].users.delete(ws);
                            cleanupSite(sitecode);
                            ws.send(JSON.stringify({ message: `Unsubscribed from ${sitecode}` }));
                        }
                    }
                } catch (err) {
                    console.log('Error parsing message:', err);
                    ws.send(JSON.stringify({ error: 'Invalid message format' }));
                }
            });

            ws.on('close', () => {
                console.log('Client disconnected');
                if (subscribedSitecode && siteSubscribers[subscribedSitecode]) {
                    siteSubscribers[subscribedSitecode].users.delete(ws);
                    cleanupSite(subscribedSitecode);
                }
            });
        });
    }

    function cleanupSite(sitecode) {
        const entry = siteSubscribers[sitecode];
        if (entry && entry.users.size === 0) {
            if (entry.unsubscribeFn) entry.unsubscribeFn();
            delete siteSubscribers[sitecode];
            console.log(`Stopped listening for sitecode: ${sitecode}`);
        }
    }

    module.exports = { setupWebSocketServer };
