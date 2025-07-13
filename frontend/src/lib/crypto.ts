export async function getKeyFromMaster(
  masterPassword: string,
  salt: string
): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(masterPassword),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptPassword(
  plain: string,
  key: CryptoKey
): Promise<{ encrypted: string; iv: string }> {
  const enc = new TextEncoder();
  const data = enc.encode(plain);
  const iv = crypto.getRandomValues(new Uint8Array(12)).buffer; // ✅ korrekt!

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );
  return {
    encrypted: bufferToBase64(encrypted),
    iv: bufferToBase64(iv),
  };
}

export async function decryptPassword(
  encryptedBase64: string,
  ivBase64: string,
  key: CryptoKey
): Promise<string> {
  const dec = new TextDecoder();
  const encrypted = base64ToBuffer(encryptedBase64);
  const iv = base64ToBuffer(ivBase64);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encrypted
  );
  return dec.decode(decrypted);
}

// Helper base64
function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const buffer = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
  return buffer.buffer; // <<<< WICHTIG: das ArrayBuffer-Objekt zurückgeben
}
