import { Outlet, Link } from "react-router-dom";

export default function LeagueLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 to-black p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Football Manager
      </h1>

      {/* Navigation */}
      <div className="flex gap-4 mb-10">
        <Link to="/" className="bg-gray-200 px-4 py-2 rounded">Tabelle</Link>
        <Link to="/heim" className="bg-gray-200 px-4 py-2 rounded">Heimtabelle</Link>
        <Link to="/auswaerts" className="bg-gray-200 px-4 py-2 rounded">Auswärtstabelle</Link>
        <Link to="/spieltag" className="bg-gray-200 px-4 py-2 rounded">Spieltag</Link>
        <Link to="/kader" className="bg-blue-600 text-white px-4 py-2 rounded">
          Kader
        </Link>
      </div>

      {/* Seiteninhalt */}
      <Outlet />

    </div>
  );
}