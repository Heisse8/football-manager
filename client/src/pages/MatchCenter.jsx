import { useEffect, useState } from "react";
import axios from "axios";

export default function MatchCenter() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios.get("/api/match/my-month", { withCredentials: true })
      .then(res => setMatches(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="match-center">
      <h1>Spieltag</h1>

      {matches.map(match => (
        <div key={match._id} className="match-card">

          <h2>
            {match.homeTeam.name} {match.homeGoals} : {match.awayGoals} {match.awayTeam.name}
          </h2>

          <p>Status: {match.status}</p>

          {match.played && (
            <>
              <h3>Statistiken</h3>
              <p>Ballbesitz: {match.possession.home}% - {match.possession.away}%</p>
              <p>xG: {match.xG.home} - {match.xG.away}</p>
              <p>Schüsse: {match.shots.home} - {match.shots.away}</p>

              <h3>Ticker</h3>
              <ul>
                {match.ticker?.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>

              <h3>Spielbericht</h3>
              <p>{match.summary}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}