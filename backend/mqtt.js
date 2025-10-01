// Install dependencies first: npm install mqtt

const mqtt = require("mqtt");

// Replace with your broker details

//const topic = "#";

const topic = "#"
//const topic = "/devices/presence_sensor_fp2_8b53/events/"
const brokerUrl = 'mqtt://mqtt.arquel.la:8883';
const options = {
  clientId: 'mqttx_819af243_connect_hub_api',
  username: 'vayyar',
  password: 'Arquella',
  clean: true
};


// Connect with authentication
const client = mqtt.connect(brokerUrl, options);
  
client.on("connect", () => {
  console.log(`Connected to MQTT broker at ${brokerUrl} as ${options.username}`);

  // Subscribe to the topic
  client.subscribe(topic, (err) => {
    if (err) {
      console.error("Subscription error:", err);
    } else {
      console.log(`Subscribed to topic: ${topic}`);
    }
  });
});

// Listen for messages
client.on("message", (receivedTopic, message) => {
  //console.log(receivedTopic);
  const device = receivedTopic.split("/");
  
  console.log(device[2]);



  //`devices/presence_sensor_fp2_8b53
  //console.log(JSON.parse(message.toString()));
  //console.log(`Message received on ${receivedTopic}: ${message.toString()}`);
});

// Handle errors
client.on("error", (err) => {
  console.error("Connection error:", err);
  client.end();
});
