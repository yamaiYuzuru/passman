// src/components/AddPasswordForm.tsx
import { useState } from "react";
import { encryptPassword, getKeyFromMaster } from "../lib/crypto";

export default function AddPasswordForm() {
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const master = localStorage.getItem("masterPassword");
    if (!master) {
      alert("Kein Master-Passwort gefunden!");
      setLoading(false);
      return;
    }

    const key = await getKeyFromMaster(master, "dein-salt"); // Ersetze ggf. mit userId
    const { encrypted, iv } = await encryptPassword(password, key);

    await fetch("http://localhost:3000/passwords", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        website,
        username,
        password: encrypted,
        iv,
      }),
    });

    setWebsite("");
    setUsername("");
    setPassword("");
    setSuccess(true);
    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow max-w-md mx-auto mt-8 space-y-4"
    >
      <h2 className="text-xl font-bold">🔐 Neues Passwort hinzufügen</h2>

      <input
        type="text"
        placeholder="Website (z. B. github.com)"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-xl border border-gray-300"
      />

      <input
        type="text"
        placeholder="Benutzername oder E-Mail"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-xl border border-gray-300"
      />

      <input
        type="password"
        placeholder="Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-xl border border-gray-300"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
      >
        {loading ? "Speichern..." : "Passwort speichern"}
      </button>

      {success && (
        <p className="text-green-600 text-sm">✅ Passwort gespeichert!</p>
      )}
    </form>
  );
}
