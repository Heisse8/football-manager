import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      }
    );

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);

      // Prüfen ob Team existiert
      const teamRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/team`,
        {
          headers: {
            Authorization: "Bearer " + data.token
          }
        }
      );

      if (teamRes.status === 404) {
        navigate("/create-team");
      } else {
        navigate("/");
      }
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-black/60 p-8 rounded-xl w-96">
        <h2 className="text-2xl mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 bg-gray-800 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Passwort"
          className="w-full mb-4 p-2 bg-gray-800 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 p-2 rounded">
          Einloggen
        </button>

        <p className="mt-4 text-sm text-center">
          Noch keinen Account?{" "}
          <Link to="/register" className="underline">
            Jetzt registrieren
          </Link>
        </p>
      </form>
    </div>
  );
}