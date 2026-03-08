const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

/* =====================================================
MIDDLEWARE
===================================================== */

app.use(cors());
app.use(express.json());

/* =====================================================
DATABASE
===================================================== */

mongoose.connect(process.env.MONGO_URI)
.then(()=>{

console.log("MongoDB verbunden");

/* Crons starten */

startMatchdayCron();
startAuctionCron();
startFreeAgentCron();
startFreeAgentMarketCron();
startBotTransferCron();
startSeasonCron();
startBotLineupCron();
startBotTacticCron();
startCompetitionCron();

})
.catch(err=>console.error("Mongo Fehler:",err));

/* =====================================================
ROUTES IMPORT
===================================================== */

const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const playerRoutes = require("./routes/player");
const matchRoutes = require("./routes/match");
const managerRoutes = require("./routes/manager");
const stadiumRoutes = require("./routes/stadium");
const newsRoutes = require("./routes/news");
const leagueRoutes = require("./routes/league");
const notificationRoutes = require("./routes/notifications");

const { startMatchdayCron } = require("./cron/matchdayCron");
const { startAuctionCron } = require("./cron/auctionCron");
const { startFreeAgentCron } = require("./cron/freeAgentCron");
const { startBotTransferCron } = require("./cron/botTransferCron");
const { startSeasonCron } = require("./cron/seasonCron");
const { startFreeAgentMarketCron } = require("./cron/freeAgentMarketCron");
const { startBotLineupCron } = require("./cron/botLineupCron");
const { startBotTacticCron } = require("./cron/botTacticCron");
const { startCompetitionCron } = require("./cron/competitionCron");

const transferRoutes = require("./routes/transfer");
const marketRoutes = require("./routes/market");

/* =====================================================
API ROUTES
WICHTIG: Diese müssen vor dem Frontend kommen
===================================================== */

app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
const sponsorRoutes = require("./routes/sponsor");

app.use("/api/sponsor", sponsorRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/stadium", stadiumRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/league", leagueRoutes); 
app.use("/api/notifications", notificationRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/market", marketRoutes);

/* =====================================================
FRONTEND (VITE BUILD)
===================================================== */

const clientPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientPath));

app.use((req,res)=>{
res.sendFile(path.join(clientPath,"index.html"));
});

/* =====================================================
SERVER START
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`Server läuft auf Port ${PORT}`);
});