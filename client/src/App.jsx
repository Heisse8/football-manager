import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./Layout";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeamPage from "./pages/TeamPage";
import CreateTeam from "./pages/CreateTeam";
import VerifySuccess from "./pages/VerifySuccess";
import Kalender from "./pages/Kalender";
import StadiumPage from "./pages/StadiumPage"; // ✅ WICHTIG
import MatchCenter from "./pages/MatchCenter";
import Spieltag from "./pages/Spieltag";
import MatchDetail from "./pages/MatchDetail";

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* ================= ÖFFENTLICHE SEITEN ================= */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-success" element={<VerifySuccess />} />

        {/* ================= GESCHÜTZTE SEITEN MIT NAVBAR ================= */}
        <Route
  element={
    <PrivateRoute>
      <Layout />
    </PrivateRoute>
  }
>
  <Route path="/" element={<Dashboard />} />
  <Route path="/kalender" element={<Kalender />} />
  <Route path="/team" element={<TeamPage />} />
  <Route path="/stadium" element={<StadiumPage />} />
  <Route path="/match/:id" element={<MatchDetail />} />

  <Route path="/spieltag" element={<Spieltag />} />
  <Route path="/match/:id" element={<MatchDetail />} />

  <Route path="/matchcenter" element={<MatchCenter />} />
  <Route path="/finanzen" element={<div className="p-10">Finanzen</div>} />
</Route>

        {/* ================= CREATE TEAM OHNE NAVBAR ================= */}
        <Route
          path="/create-team"
          element={
            <PrivateRoute>
              <CreateTeam />
            </PrivateRoute>
          }
        />

      </Routes>
    </AuthProvider>
  );
}