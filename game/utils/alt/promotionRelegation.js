const Team = require("../../models/Team");

async function handlePromotionRelegation() {
  const countries = ["GER", "ENG", "ESP", "FRA", "ITA"];

  for (let country of countries) {
    const league1 = `${country}_1`;
    const league2 = `${country}_2`;

    // 🔹 Liga 1 sortieren
    const league1Teams = await Team.find({ league: league1 });

    const sortedLeague1 = league1Teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;

      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;

      if (diffB !== diffA) return diffB - diffA;

      return a.name.localeCompare(b.name);
    });

    // 🔹 Liga 2 sortieren
    const league2Teams = await Team.find({ league: league2 });

    const sortedLeague2 = league2Teams.sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;

      const diffA = a.goalsFor - a.goalsAgainst;
      const diffB = b.goalsFor - b.goalsAgainst;

      if (diffB !== diffA) return diffB - diffA;

      return a.name.localeCompare(b.name);
    });

    // 🔻 Letzte 3 aus Liga 1
    const relegated = sortedLeague1.slice(-3);

    // 🔺 Erste 3 aus Liga 2
    const promoted = sortedLeague2.slice(0, 3);

    // Liga wechseln
    for (let team of relegated) {
      team.league = league2;
      await team.save();
    }

    for (let team of promoted) {
      team.league = league1;
      await team.save();
    }
  }

  console.log("✅ Auf- und Abstieg durchgeführt");
}

module.exports = handlePromotionRelegation;