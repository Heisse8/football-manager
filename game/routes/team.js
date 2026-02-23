// Anzahl existierender Teams zählen
const teamCount = await Team.countDocuments();

// Liga automatisch bestimmen
let country;
let league;

const index = teamCount + 1;

if (index <= 18) {
  country = "Deutschland";
  league = "Liga 1";
} else if (index <= 36) {
  country = "Deutschland";
  league = "Liga 2";
} else if (index <= 54) {
  country = "England";
  league = "Liga 1";
} else if (index <= 72) {
  country = "England";
  league = "Liga 2";
} else {
  country = "Deutschland";
  league = "Liga 1";
}