import { useState } from "react";

export default function Register() {
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
    alert(data.message);
  };

  return (
    <form onSubmit={handleRegister}>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Passwort" onChange={(e) => setPassword(e.target.value)} />
      <button>Registrieren</button>
    </form>
  );
}