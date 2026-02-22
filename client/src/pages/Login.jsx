import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("https://football-manager-z7rr.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("clubId", data.clubId);
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-black/60 backdrop-blur-md p-8 rounded-xl w-96 shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 bg-gray-800 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          className="w-full mb-4 p-2 bg-gray-800 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded transition">
          Einloggen
        </button>

        <p className="mt-4 text-sm text-center">
          Noch keinen Account?{" "}
          <Link to="/register" className="text-blue-400 underline">
            Jetzt registrieren
          </Link>
        </p>
      </form>
    </div>
  );
}