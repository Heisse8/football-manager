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

        {/* Geschützter Bereich */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <>
                <Navbar />

                <Routes>
                  {/* Startseite */}
                  <Route path="/" element={<Dashboard />} />

                  {/* Manager Seiten */}
                  <Route path="/team" element={<Teammanagement />} />
                  <Route path="/training" element={<div className="p-10 text-white">Training</div>} />
                  <Route path="/transfermarkt" element={<div className="p-10 text-white">Transfermarkt</div>} />
                  <Route path="/scouting" element={<div className="p-10 text-white">Scouting</div>} />
                  <Route path="/stadion" element={<div className="p-10 text-white">Stadion</div>} />
                  <Route path="/finanzen" element={<div className="p-10 text-white">Finanzen</div>} />
                </Routes>

              </>
            </PrivateRoute>
          }
        />

      </Routes>
    </AuthProvider>
  );
}