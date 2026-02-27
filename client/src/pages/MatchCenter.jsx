useEffect(() => {
  const loadMatches = async () => {
    try {
      const res = await fetch("/api/match/current");
      const data = await res.json();

      // Nur berechnete Spiele
      const playedMatches = data.filter(m => m.played);
      setMatches(playedMatches);
    } catch (err) {
      console.error("Fehler beim Laden der Spiele");
    }
  };

  loadMatches();
}, []);

<div
  key={match._id}
  onClick={() => match.played && navigate(`/match/${match._id}`)}
  className={`p-6 rounded-xl shadow-lg transition ${
    match.played
      ? "cursor-pointer hover:bg-white/20 bg-white/10"
      : "opacity-40 bg-white/5"
  }`}
></div>