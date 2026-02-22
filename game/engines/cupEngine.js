const { simulateMatch } = require("./matchEngine");

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function drawAndPlayCupRound(teams, roundName, newsFeed, isFinal = false) {

  const shuffled = shuffle(teams);
  const nextRound = [];

  while (shuffled.length > 0) {

    if (shuffled.length === 1) {
      const free = shuffled.pop();
      nextRound.push(free);

      newsFeed.push({
        type: "cup_bye",
        round: roundName,
        team: free.name
      });

      break;
    }

    const a = shuffled.pop();
    const b = shuffled.pop();

    const home = Math.random() < 0.5 ? a : b;
    const away = home === a ? b : a;

    newsFeed.push({
      type: "cup_draw",
      round: roundName,
      home: home.name,
      away: away.name
    });

    const result = simulateMatch(home, away, isFinal);

    const winner =
      result.homeGoals >= result.awayGoals ? home : away;

    nextRound.push(winner);

    newsFeed.push({
      type: "cup_result",
      round: roundName,
      result: `${home.name} ${result.homeGoals}-${result.awayGoals} ${away.name}`,
      winner: winner.name
    });
  }

  return nextRound;
}

module.exports = { drawAndPlayCupRound };