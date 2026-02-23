import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./Layout";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teammanagement from "./pages/Teammanagement";
import CreateTeam from "./pages/CreateTeam";
import VerifySuccess from "./pages/VerifySuccess";
import Kalender from "./pages/Kalender";
import StadiumPage from "./pages/StadiumPage"; // ✅ WICHTIG
import MatchCenter from "./pages/MatchCenter";

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
          <Route path="/team" element={<Teammanagement />} />
          <Route path="/stadium" element={<StadiumPage />} /> {/* ✅ Stadion */}

          <Route
            path="/training"
            element={<div className="p-10">Training</div>}
          />

          <Route
            path="/transfermarkt"
            element={<div className="p-10">Transfermarkt</div>}
          />

          <Route
            path="/scouting"
            element={<div className="p-10">Scouting</div>}
          />

          <Route path="/matchcenter" element={<MatchCenter />} />

          <Route
            path="/finanzen"
            element={<div className="p-10">Finanzen</div>}
          />
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