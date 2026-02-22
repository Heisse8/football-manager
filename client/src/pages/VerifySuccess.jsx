import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function VerifySuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      navigate("/create-team");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div className="p-10 text-white">Account wird aktiviert...</div>;
}