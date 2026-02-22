import { useState } from "react";

export default function Register() {
  const [message, setMessage] = useState("");

  return (
    <div style={{ padding: "50px", color: "white", background: "black", minHeight: "100vh" }}>
      <h1 style={{ color: "red" }}>REGISTER TEST</h1>

      <button
        onClick={() => setMessage("BUTTON FUNKTIONIERT")}
        style={{ padding: "10px", marginTop: "20px" }}
      >
        Klick mich
      </button>

      <div style={{ marginTop: "20px", fontSize: "20px" }}>
        {message}
      </div>
    </div>
  );
}