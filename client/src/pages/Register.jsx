import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    setMessage("Registrierung läuft...");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        }
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setMessage(data?.message || "Fehler bei Registrierung");
        return;
      }

      setMessage("✅ Bestätigungsmail wurde gesendet!");

    } catch (err) {
      setMessage("❌ Server nicht erreichbar");
    }
  };

  return (
    <div style={{ padding: "50px", color: "white", background: "#111", minHeight: "100vh" }}>
      <h1 style={{ color: "red" }}>REGISTER LIVE VERSION</h1>

      <div style={{ maxWidth: "400px", marginTop: "30px" }}>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <input
          type="password"
          placeholder="Passwort"
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
        />

        <button
          onClick={handleRegister}
          style={{ width: "100%", padding: "10px" }}
        >
          Registrieren
        </button>

        <div style={{ marginTop: "20px", fontSize: "18px" }}>
          {message}
        </div>
      </div>
    </div>
  );
}