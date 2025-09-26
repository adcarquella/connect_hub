import axios from "axios";
import { encryptPayload, decryptPayload } from "./crypto";

const API_BASE = "http://localhost:3000"; // backend URL
const ENCRYPTION_KEY_BASE64 = "your_base64_key_here"; // same key as backend

export async function sendEncryptedData(apiPath:string, data: object) {
  const plaintext = JSON.stringify(data);
  //const encrypted = encryptPayload(plaintext, ENCRYPTION_KEY_BASE64);
  const encrypted = data;

  const res = await axios.post(`${API_BASE}/${apiPath}`, { payload: encrypted });

  const decryptedResponse = decryptPayload(res.data.payload, ENCRYPTION_KEY_BASE64);
  return JSON.parse(decryptedResponse);
}

export async function getHello() {
  const res = await axios.get(`${API_BASE}/hello`);
  return res.data;
}
