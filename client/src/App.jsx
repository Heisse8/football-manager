import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Teammanagement from "./pages/Teammanagement";

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Öffentliche Seiten */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Geschützte Seiten */}
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

      </Routes>
    </AuthProvider>
  );
}