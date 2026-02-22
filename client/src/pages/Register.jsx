import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch(
      "https://football-manager-z7rr.onrender.com/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      }
    );

    const data = await res.json();
    console.log(data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/create-team"); // Neuer User → immer Team erstellen
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <form onSubmit={handleRegister} className="bg-black/60 p-8 rounded-xl w-96">
        <h2 className="text-2xl mb-6">Registrieren</h2>

        <input
          placeholder="Username"
          className="w-full mb-4 p-2 bg-gray-800 rounded"
          onChange={(e) => setUsername(e.target.value)}
        />

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

        <button className="w-full bg-green-600 p-2 rounded">
          Registrieren
        </button>

        <p className="mt-4 text-sm text-center">
          Schon registriert?{" "}
          <Link to="/login" className="underline">
            Zum Login
          </Link>
        </p>
      </form>
    </div>
  );
}