import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

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

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </PrivateRoute>
          }
        />

        <Route
  path="/kalender"
  element={
    <PrivateRoute>
      <>
        <Navbar />
        <Kalender />
      </>
    </PrivateRoute>
  }
/>

        {/* Team */}
        <Route
          path="/team"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <Teammanagement />
              </>
            </PrivateRoute>
          }
        />

        {/* Training */}
        <Route
          path="/training"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="p-10 text-white">Training</div>
              </>
            </PrivateRoute>
          }
        />

        {/* Transfermarkt */}
        <Route
          path="/transfermarkt"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="p-10 text-white">Transfermarkt</div>
              </>
            </PrivateRoute>
          }
        />

        {/* Scouting */}
        <Route
          path="/scouting"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="p-10 text-white">Scouting</div>
              </>
            </PrivateRoute>
          }
        />

        {/* Stadion */}
        <Route
          path="/stadion"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="p-10 text-white">Stadion</div>
              </>
            </PrivateRoute>
          }
        />

        {/* Finanzen */}
        <Route
          path="/finanzen"
          element={
            <PrivateRoute>
              <>
                <Navbar />
                <div className="p-10 text-white">Finanzen</div>
              </>
            </PrivateRoute>
          }
        />

        <Route path="/verify-success" element={<VerifySuccess />} />

        {/* Create Team – nur EINMAL definiert */}
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