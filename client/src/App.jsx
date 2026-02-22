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

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Öffentliche Seiten */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-success" element={<VerifySuccess />} />

        {/* Geschützte Seiten MIT Navbar */}
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

          <Route
            path="/stadion"
            element={<div className="p-10">Stadion</div>}
          />

          <Route
            path="/finanzen"
            element={<div className="p-10">Finanzen</div>}
          />
        </Route>

        {/* Create Team separat (ohne Navbar) */}
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