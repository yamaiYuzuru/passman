// src/components/LoginIsland.tsx
import React, { useState } from "react";

export default function LoginIsland() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [masterPassword, setMasterPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      setError("Login fehlgeschlagen");
      return;
    }

    const { token } = await res.json();
    // Speichere Token und Master-Passwort im localStorage (temporär)
    localStorage.setItem("token", token);
    localStorage.setItem("masterPassword", masterPassword);
    window.location.href = "/dashboard";
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Login-Passwort"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Master-Passwort"
        value={masterPassword}
        onChange={(e) => setMasterPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
