import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

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

        {/* Dashboard als Startseite */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Teammanagement eigene Route */}
        <Route
          path="/team"
          element={
            <PrivateRoute>
              <Teammanagement />
            </PrivateRoute>
          }
        />

      </Routes>
    </AuthProvider>
  );
}