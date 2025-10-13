const WebSocket = require('ws');
const mqtt = require('mqtt');
const { getDatabaseRef } = require("../data/Firebase");

const siteSubscribers = {};
let mqttClient = null;

/**
 * Setup Firebase listener for a sitecode
 */
function listenToSiteUpdates(sitecode, callback) {
    console.log(`Listening to Firebase for sitecode: ${sitecode}`);

    const siteObject = {
        liveCalls: {},
        feed: [],
        senseEvents: [] // add MQTT events here
    };

    const ref = getDatabaseRef(
        "https://arquella-cc76e-afe91.europe-west1.firebasedatabase.app",
        `sensetestPhoneLiveCalls` // could be made dynamic per sitecode
    );

    const listener = (snapshot) => {
        const data = snapshot.val();
        if (data) {
            siteObject.liveCalls = data;
        } else {
            siteObject.liveCalls = {};
        }

        // Push updated object
        callback({ sitecode, update: siteObject });
    };

    ref.on("value", listener);

    // Return unsubscribe function
    return () => ref.off("value", listener);
}

/**
 * Setup global MQTT connection (runs once)
 */
function setupMqtt() {
    if (mqttClient) return mqttClient;

    const brokerUrl = 'mqtt://mqtt.arquel.la:8883';
    const options = {
        clientId: 'mqttx_819af243_connect_hub_api',
        username: 'vayyar',
        password: 'Arquella',
        clean: true
    };
    const topic = "#"
    mqttClient = mqtt.connect(brokerUrl, options); // <-- change URL

    mqttClient.on("connect", () => {
        console.log(`Connected to MQTT broker at ${brokerUrl} as ${options.username}`);
        
        // Subscribe to the topic
        mqttClient.subscribe(topic, (err) => {
            if (err) {
                console.error("Subscription error:", err);
            } else {
                console.log(`Subscribed to topic: ${topic}`);
            }
        });


        // 🔹 Start publishing a pull request every 5 minutes
        const pullTopic = "/devices/fp2/events/pull";
        setInterval(() => {
            const payload = JSON.stringify({ action: "pull" }); // <-- adjust if your device expects something else
            mqttClient.publish(pullTopic, payload, { qos: 1 }, (err) => {
                if (err) {
                    console.error("Error publishing pull request:", err);
                } else {
                    console.log(`Pull request sent to ${pullTopic}:`, payload);
                }
            });
        }, 5 * 60 * 1000); // 5 minutes

    });

    mqttClient.on('error', (err) => {
        console.error('MQTT error:', err.message);
    });

    mqttClient.on('reconnect', () => {
        console.log('Reconnecting to MQTT broker...');
    });

    mqttClient.on('close', () => {
        console.log('MQTT connection closed');
    });


    function getDetailsFromTopic(topic) {
        try {
            const topicSplit = topic.split("/");
            const eventType = (topicSplit.length > 4) ? topicSplit[4] : '';
            return [topicSplit[2], topicSplit[3], eventType];
        }
        catch (e) { return ['', '', '']; }
    }

    mqttClient.on('message', (topic, message) => {

        const [deviceID, messageType, eventType] = getDetailsFromTopic(topic);
        
        if (messageType !== "events") return;                   //filter out none events
        if(!deviceID.includes("presence_sensor_")) return;      //filter out any not on the new devices

        console.log(topic);
        

        try {
            const parsed = JSON.parse(message.toString());
            const sitecode = "sensetest";
            if (eventType==="") return;
            const eventValue = parsed.payload.event;
            if (eventValue === undefined) return;
            console.log(eventValue);


            if (siteSubscribers[sitecode]) {
                const siteObject = siteSubscribers[sitecode].siteObject;
                siteObject.senseEvents.push({"status":eventType, "value":eventValue, "room":"test room", "zone":"1st Floor", "description":"status"});

                // Broadcast update to all connected clients
                siteSubscribers[sitecode].users.forEach(client => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ sitecode, update: siteObject }));
                    }
                });
            }
        } catch (err) {
            console.error('Error processing MQTT message:', err);
        }
    });

    return mqttClient;
}

/**
 * WebSocket server setup
 */
function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({ server, path: '/ws' });
    setupMqtt(); // ensure MQTT is up

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
                        siteSubscribers[sitecode] = {
                            users: new Set(),
                            unsubscribeFn: null,
                            siteObject: {
                                liveCalls: {},
                                feed: [],
                                senseEvents: []
                            }
                        };

                        // Start Firebase listener for this site
                        siteSubscribers[sitecode].unsubscribeFn = listenToSiteUpdates(sitecode, (update) => {
                            siteSubscribers[sitecode].users.forEach(client => {
                                if (client.readyState === WebSocket.OPEN) {
                                    client.send(JSON.stringify(update));
                                }
                            });
                        });
                    }

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

/**
 * Cleanup when no users left for a site
 */
function cleanupSite(sitecode) {
    const entry = siteSubscribers[sitecode];
    if (entry && entry.users.size === 0) {
        if (entry.unsubscribeFn) entry.unsubscribeFn(); // stop Firebase listener
        delete siteSubscribers[sitecode];
        console.log(`Stopped listening for sitecode: ${sitecode}`);
    }
}

module.exports = { setupWebSocketServer };
