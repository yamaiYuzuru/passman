// src/components/PasswordListIsland.tsx
import React, { useEffect, useState } from "react";
import * as crypto from "../lib/crypto";

export default function PasswordListIsland() {
  const [entries, setEntries] = useState<any[]>([]);
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [form, setForm] = useState({
    serviceName: "",
    username: "",
    password: "",
    url: "",
  });

  useEffect(() => {
    const masterPassword = localStorage.getItem("masterPassword")!;
    crypto.deriveKeyFromPassword(masterPassword).then(setKey);
    fetchPasswords();
  }, []);

  async function fetchPasswords() {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/passwords", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    setEntries(data);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!key) return;

    const token = localStorage.getItem("token");
    const { encrypted, iv } = await crypto.encryptPassword(form.password, key);

    await fetch("http://localhost:3000/passwords", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        ...form,
        encryptedPassword: encrypted,
        iv,
      }),
    });

    setForm({ serviceName: "", username: "", password: "", url: "" });
    fetchPasswords();
  }

  return (
    <div>
      <form onSubmit={handleAdd}>
        <input
          placeholder="Dienst"
          value={form.serviceName}
          onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
        />
        <input
          placeholder="Benutzername"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          placeholder="Passwort"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <input
          placeholder="URL (optional)"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
        />
        <button type="submit">Hinzufügen</button>
      </form>

      <h2>Gespeicherte Einträge</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            <strong>{entry.serviceName}</strong> – {entry.username} <br />
            🔑{" "}
            <DecryptablePassword
              encrypted={entry.encryptedPassword}
              iv={entry.iv}
              keyRef={key}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

function DecryptablePassword({
  encrypted,
  iv,
  keyRef,
}: {
  encrypted: string;
  iv: string;
  keyRef: CryptoKey | null;
}) {
  const [decrypted, setDecrypted] = useState("********");

  async function handleDecrypt() {
    if (keyRef) {
      const plain = await crypto.decryptPassword(encrypted, iv, keyRef);
      setDecrypted(plain);
    }
  }

  return (
    <span onClick={handleDecrypt} style={{ cursor: "pointer" }}>
      {decrypted}
    </span>
  );
}
