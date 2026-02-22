import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password })
        }
      );

      const text = await res.text(); // zeigt IMMER die Antwort
      setMessage("Server Antwort: " + text);

    } catch (error) {
      console.error(error);
      setMessage("Serverfehler – Verbindung fehlgeschlagen.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

      <h1 style={{ color: "red", fontSize: "28px", position: "absolute", top: 20 }}>
        TEST REGISTER VERSION
      </h1>

      <form
        onSubmit={handleRegister}
        className="bg-black/60 p-8 rounded-xl w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Registrieren</h2>

        <input
          placeholder="Username"
          required
          className="w-full p-2 bg-gray-800 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full p-2 bg-gray-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          required
          className="w-full p-2 bg-gray-800 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-green-600 p-2 rounded hover:bg-green-500"
        >
          Registrieren
        </button>

        {message && (
          <div className="text-sm text-center mt-3 text-yellow-400">
            {message}
          </div>
        )}

        <p className="text-sm text-center mt-4">
          Bereits einen Account?{" "}
          <Link to="/login" className="underline">
            Jetzt einloggen
          </Link>
        </p>
      </form>
    </div>
  );
}