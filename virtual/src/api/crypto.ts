// AES-256-GCM encryption/decryption using Node/Web Crypto
import crypto from "crypto";

export function encryptPayload(plainText: string, keyBase64: string): string {
  const key = Buffer.from(keyBase64, "base64"); // 32 bytes
  const iv = crypto.randomBytes(12); // 12 bytes for GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const out = Buffer.concat([iv, ciphertext, tag]);
  return out.toString("base64");
}

export function decryptPayload(base64Payload: string, keyBase64: string): string {
  const key = Buffer.from(keyBase64, "base64");
  const data = Buffer.from(base64Payload, "base64");
  const iv = data.slice(0, 12);
  const tag = data.slice(data.length - 16);
  const ciphertext = data.slice(12, data.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return decrypted.toString("utf8");
}
