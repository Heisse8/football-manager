import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔐 Wenn bereits eingeloggt → direkt ins Dashboard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        setLoading(false);
        return;
      }

      // ✅ Token speichern
      localStorage.setItem("token", data.token);

      // ✅ Weiterleitung ins Dashboard
      navigate("/");

    } catch (err) {
      setMessage("Serverfehler");
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/stadium.jpg')" }}
    >
      <div className="bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white">

        <h2 className="text-3xl font-bold text-center mb-6">
          Login ⚽
        </h2>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Passwort"
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 transition p-3 rounded-lg font-semibold"
          >
            {loading ? "Login läuft..." : "Login"}
          </button>

          {message && (
            <div className="text-center text-sm mt-3 text-red-400">
              {message}
            </div>
          )}

          {/* 🔗 Register Link */}
          <p className="text-center text-sm mt-4 text-gray-300">
            Noch keinen Account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-green-400 cursor-pointer hover:underline"
            >
              Jetzt registrieren
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}