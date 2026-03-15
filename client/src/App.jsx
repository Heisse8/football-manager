import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import PrivateRoute from "./components/PrivateRoute";
import Layout from "./Layout";

/* Pages */

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TeamPage from "./pages/TeamPage";
import CreateTeam from "./pages/CreateTeam";
import VerifySuccess from "./pages/VerifySuccess";
import Kalender from "./pages/Kalender";
import StadiumPage from "./pages/StadiumPage";
import MatchCenter from "./pages/MatchCenter";
import MatchDetail from "./pages/MatchDetail";
import Spieltag from "./pages/Spieltag";
import Finances from "./pages/Finances";
import Transfermarkt from "./pages/Transfermarkt";
import ScoutPage from "./pages/ScoutPage.jsx/index.js";
import CompetitionsPage from "./pages/CompetitionsPage.jsx";

export default function App(){

return (

<AuthProvider>

<Routes>

{/* ================= PUBLIC ROUTES ================= */}

<Route path="/register" element={<Register />} />
<Route path="/login" element={<Login />} />
<Route path="/verify-success" element={<VerifySuccess />} />

{/* ================= PROTECTED ROUTES WITH NAVBAR ================= */}

<Route
element={
<PrivateRoute>
<Layout />
</PrivateRoute>
}
>

<Route path="/" element={<Dashboard />} />

<Route path="/team" element={<TeamPage />} />

<Route path="/transfermarkt" element={<Transfermarkt />} />

<Route path="/kalender" element={<Kalender />} />

<Route path="/stadium" element={<StadiumPage />} />

<Route path="/finanzen" element={<Finances />} />

<Route path="/matchcenter" element={<MatchCenter />} />

<Route path="/spieltag" element={<Spieltag />} />

<Route path="/match/:id" element={<MatchDetail />} />

<Route path="/scouting" element={<ScoutPage />} />

<Route path="/wettbewerbe" element={<CompetitionsPage />} />

</Route>

{/* ================= CREATE TEAM (NO NAVBAR) ================= */}

<Route
path="/create-team"
element={
<PrivateRoute>
<CreateTeam />
</PrivateRoute>
}
/>

{/* ================= FALLBACK ================= */}

<Route path="*" element={<Navigate to="/" replace />} />

</Routes>

</AuthProvider>

);

}