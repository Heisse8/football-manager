import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import bgImage from "./assets/manager-office.jpg";

export default function Layout() {
  return (
    <div className="relative min-h-screen text-white overflow-hidden">

      {/* Hintergrundbild */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dunkler Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/90" />

      {/* Inhalt */}
      <div className="relative z-10">
        <Navbar />
        <Outlet />
      </div>

    </div>
  );
}