const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const path = require("path");

require("dotenv").config();

const app = express();

app.set("trust proxy", 1);

/* =====================================================
SECURITY MIDDLEWARE
===================================================== */

app.use(helmet());

app.use(cors({
origin: "*",
methods: ["GET","POST","PUT","DELETE"],
allowedHeaders:["Content-Type","Authorization"]
}));

/* =====================================================
RATE LIMIT
===================================================== */

const apiLimiter = rateLimit({
windowMs: 15 * 60 * 1000,
max: 1000,
message: {
message:"Zu viele Requests. Bitte später erneut versuchen."
}
});

app.use("/api", apiLimiter);

/* =====================================================
BODY PARSER
===================================================== */

app.use(express.json({limit:"2mb"}));

/* =====================================================
CRON IMPORTS
===================================================== */

const { startMatchdayCron } = require("./cron/matchdayCron");
const { startAuctionCron } = require("./cron/auctionCron");
const { startFreeAgentCron } = require("./cron/freeAgentCron");
const { startBotTransferCron } = require("./cron/botTransferCron");
const { startSeasonCron } = require("./cron/seasonCron");
const { startFreeAgentMarketCron } = require("./cron/freeAgentMarketCron");
const { startBotLineupCron } = require("./cron/botLineupCron");
const { startBotTacticCron } = require("./cron/botTacticCron");
const { startCompetitionCron } = require("./cron/competitionCron");
const { startPlayerPoolCron } = require("./cron/playerPoolCron");
const { startAuctionResolverCron } = require("./cron/auctionResolverCron");
const { startMatchdaySimulatorCron } = require("./cron/matchdaySimulatorCron");
const { startPlayerRecoveryCron } = require("./cron/playerRecoveryCron");

/* =====================================================
UTILS
===================================================== */

const { seedLeagues } = require("./utils/leagueSeeder");
const { generatePlayerPool } = require("./utils/playerPool");

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
const transferRoutes = require("./routes/transfer");
const marketRoutes = require("./routes/market");
const sponsorRoutes = require("./routes/sponsor");
const dashboardRoutes = require("./routes/dashboard");
const simulationTestRoutes = require("./routes/simulationTest");

/* =====================================================
HEALTH CHECK
===================================================== */

app.get("/api/health",(req,res)=>{
res.json({
status:"ok",
time:new Date()
});
});

/* =====================================================
API ROUTES
===================================================== */

app.use("/api/auth", authRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/player", playerRoutes);
app.use("/api/match", matchRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/stadium", stadiumRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/league", leagueRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/market", marketRoutes);
app.use("/api/sponsor", sponsorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/simulate", simulationTestRoutes);

/* =====================================================
FRONTEND BUILD
===================================================== */

const clientPath = path.join(__dirname, "../client/dist");

app.use(express.static(clientPath));

app.use((req,res)=>{
res.sendFile(path.join(clientPath,"index.html"));
});

/* =====================================================
GLOBAL ERROR HANDLER
===================================================== */

app.use((err,req,res,next)=>{

console.error("Server Error:",err);

res.status(500).json({
message:"Interner Serverfehler"
});

});

/* =====================================================
DATABASE CONNECTION
===================================================== */

mongoose.connect(process.env.MONGO_URI)
.then(async ()=>{

console.log("MongoDB verbunden");

/* =====================================================
SPIELWELT INITIALISIEREN
===================================================== */

await seedLeagues();

console.log("Ligen & Bots erstellt");

/* Spielerpool generieren */

await generatePlayerPool();

console.log("Spielerpool erstellt");

/* =====================================================
CRON JOBS STARTEN
===================================================== */

startMatchdayCron();
startAuctionCron();
startFreeAgentCron();
startFreeAgentMarketCron();
startBotTransferCron();
startSeasonCron();
startBotLineupCron();
startBotTacticCron();
startCompetitionCron();
startPlayerPoolCron();
startAuctionResolverCron();
startMatchdaySimulatorCron();
startPlayerRecoveryCron();

console.log("Cron Jobs gestartet");

/* =====================================================
SERVER START
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
console.log(`Server läuft auf Port ${PORT}`);
});

})
.catch(err=>{
console.error("Mongo Fehler:",err);
process.exit(1);
});