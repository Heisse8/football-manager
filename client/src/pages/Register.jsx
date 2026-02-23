import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(true);
  }, []);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setTimeout(() => {
          navigate("/login");
        }, 2500);
      }

    } catch (err) {
      setMessage("Serverfehler");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/stadium.jpg')" }}
    >
      <div className={`bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white transition-all duration-700 ${
        fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}>
        <h2 className="text-3xl font-bold text-center mb-6">Registrieren ⚽</h2>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Passwort"
              className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none pr-12"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Passwort bestätigen"
            className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 transition p-3 rounded-lg font-semibold"
          >
            {loading ? "Lädt..." : "Registrieren"}
          </button>

          {message && (
            <div className="text-center text-sm mt-3 text-yellow-400">
              {message}
            </div>
          )}

          <div className="text-center text-sm mt-4 text-gray-400">
            Bereits einen Account?{" "}
            <Link to="/login" className="text-green-400 hover:underline">
              Jetzt einloggen
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}