import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Teammanagement from "./pages/Teammanagement";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Öffentliche Seiten */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Geschützte Seite */}
        <Route
          path="/"
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