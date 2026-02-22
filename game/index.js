require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Team = require("./models/Team");
const League = require("./models/League");

const leagueRoutes = require("./routes/league");
const matchRoutes = require("./routes/matches");
const teamRoutes = require("./routes/team");

const { startScheduler } = require("./engines/scheduler");
const { generateSquad } = require("./utils/playerGenerator");

const authRoutes = require("./routes/auth");

const app = express();

/* =========================
   MIDDLEWARE
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   DATABASE
========================= */

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB verbunden");

    await initializeTeamsIfNeeded();
    await initializeLeagueIfNeeded();

  })
  .catch((err) => {
    console.error("❌ MongoDB Fehler:", err);
  });

/* =========================
   ROUTES
========================= */

app.use("/api/league", leagueRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/auth", authRoutes);

/* =========================
   ROOT
========================= */

app.get("/", (req, res) => {
  res.send("⚽ Football Manager Backend läuft");
});

/* =========================
   SERVER START
========================= */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
  startScheduler();
});

/* =========================
   TEAMS AUTOMATISCH ERSTELLEN
========================= */

async function initializeTeamsIfNeeded() {

  const existingTeams = await Team.find({});
  if (existingTeams.length > 0) {
    console.log("ℹ️ Teams existieren bereits");
    return;
  }

  console.log("🔥 Erstelle automatisch Demo-Teams...");

  const teamNames = [
    "FC Thomas",
    "Dynamo Code",
    "SV Manager",
    "FC Test"
  ];

  for (const name of teamNames) {
    const newTeam = new Team({
      name: name,
      players: generateSquad()
    });

    await newTeam.save();
  }

  console.log("✅ Demo-Teams erstellt");
}

/* =========================
   LEAGUE AUTOMATISCH ERSTELLEN
========================= */

async function initializeLeagueIfNeeded() {

  const existingLeague = await League.findOne();
  if (existingLeague) {
    console.log("ℹ️ League existiert bereits");
    return;
  }

  const teams = await Team.find({});
  if (teams.length < 2) {
    console.log("⚠️ Nicht genug Teams für League");
    return;
  }

  console.log("🔥 Erstelle automatisch neue League...");

  const schedule = [];
  const teamList = [...teams];

  for (let i = 0; i < teamList.length - 1; i++) {

    const matchday = [];

    for (let j = 0; j < teamList.length / 2; j++) {
      const home = teamList[j];
      const away = teamList[teamList.length - 1 - j];

      matchday.push({
        home: home._id,
        away: away._id,
        homeGoals: null,
        awayGoals: null,
        played: false
      });
    }

    teamList.splice(1, 0, teamList.pop());
    schedule.push(matchday);
  }

  const league = new League({
    currentMatchday: 1,
    schedule: schedule
  });

  await league.save();

  console.log("✅ League automatisch erstellt");
}