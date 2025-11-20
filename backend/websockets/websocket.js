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
        clientId: 'mqttx_819af243_connect_hub_sa',
        username: 'vayyar',
        password: 'Arquella',
        clean: true
    };
    const topic = "#"
    mqttClient = mqtt.connect(brokerUrl, options); // <-- change URL

    function sendPullRequest(pullTopic) {
        const payload = JSON.stringify({ "request_id": "1760628593248", "all": true }); // <-- adjust if your device expects something else
        mqttClient.publish(pullTopic, payload, { qos: 1 }, (err) => {
            if (err) {
                console.error("Error publishing pull request:", err);
            } else {
                console.log(`Pull request sent to ${pullTopic}:`, payload);
            }
        });

    }

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
            //            console.log(topicSplit);
            const eventType = (topicSplit.length > 4) ? topicSplit[4] : '';
            return [topicSplit[2], topicSplit[3], eventType];
        }
        catch (e) { return ['', '', '']; }
    }

    function updateSubscription(sitecode, deviceName, eventType, eventValue) {
        if (siteSubscribers[sitecode]) {
            const siteObject = siteSubscribers[sitecode].siteObject;
            try {
                if (!siteObject.senseEvents[deviceName]) {
                    siteObject.senseEvents[deviceName] = {
                        status: "",
                        lightLevel: "",
                        deviceName: deviceName,
                        room: "",
                        zone: "",
                        description: "",
                        presenceStart:0
                    };
                    sendPullRequest("/devices/fp2/events/pull");
                }
                //siteObject.senseEvents[deviceName] = siteObject.senseEvents[deviceName] || {};
                // Now assign the lightlevel property
                siteObject.senseEvents[deviceName][eventType] = eventValue;



            }
            catch (e) {
                console.log(e);
            }

            // Broadcast update to all connected clients
            siteSubscribers[sitecode].users.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ sitecode, update: siteObject }));
                }
            });

        }

    }

    function cutDownDeviceID(deviceID){
        deviceID = deviceID.replace("presence_sensor_", "");
        deviceID = deviceID.replace("_room", "");
        return deviceID;
    }


    mqttClient.on('message', (topic, message) => {

        const [deviceID, messageType, eventType] = getDetailsFromTopic(topic);

        if (messageType !== "events") return;                   //filter out none events
        if (!deviceID.includes("presence_sensor_")) return;      //filter out any not on the new devices
        
        const trueDeviceID = cutDownDeviceID(deviceID);
        console.log("DEVICEID:", trueDeviceID);

        try {
            const parsed = JSON.parse(message.toString());

            const sitecode = "sensetest";

            switch (eventType) {
                case "light":
                    if (parsed.payload) {
                        updateSubscription(sitecode, "testroom", "lightLevel", (parsed.payload.light) ? parsed.payload.light : 0)
                    }
                    break;
                case "chair":
                case "room":
                case "bed" :
                    if (parsed.payload) {
                        updateSubscription(sitecode, "testroom", "status", (parsed.payload.event) ? eventType : "");
                    }
                    break;
                case "sync":
                    console.log("sync data");
                    console.log(parsed);
                    ///  presence
                    if (parsed) {

                        try {
                            updateSubscription(sitecode, "testroom", "status", (parsed.current.state==="empty")?"":parsed.current.state)
                            try {
                                updateSubscription(sitecode, "testroom", "presenceStart", (parsed.snapshot.presence==="empty")?"":parsed.snapshot.presence)
                            }
                            catch(e){
                                console.log("Error setting presence start", e);
                            }
                        }
                        catch (e) {
                            console.log(e)
                        }
                    }
                    break;
                case "":
                    break;

                default:
                    console.log("unrecorded path", eventType)
                    console.log(deviceID, messageType, eventType);
                    console.log(parsed);
            }

        } catch (err) {
            //console.error('Error processing MQTT message:', err);
            //const parsed = JSON.parse(message.toString());
            //console.log(parsed);
        }
    });

    return mqttClient;
}


function getLiveCallsObject(siteCode) {
    try {
        console.log(siteSubscribers[siteCode]);
        return siteSubscribers[siteCode].siteObject.liveCalls;
    }
    catch (e) {
        return {};
    }
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
                        console.log("setting live calls");
                        siteSubscribers[sitecode] = {
                            users: new Set(),
                            unsubscribeFn: null,
                            siteObject: {
                                liveCalls: getLiveCallsObject(sitecode),
                                feed: [],
                                senseEvents: {}
                            }
                        };

                        // Start Firebase listener for this site
                        siteSubscribers[sitecode].unsubscribeFn = listenToSiteUpdates(sitecode, (update) => {
                            console.log("sdsupdate", update);
                            console.log("kksdfsvak", siteSubscribers[sitecode]);
                            try {
                                siteSubscribers[sitecode].siteObject.liveCalls = update.update.liveCalls;
                            }
                            catch (e) {
                                console.log("Unable to set the livecalls for the site.");
                                console.log(e);
                            }
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
