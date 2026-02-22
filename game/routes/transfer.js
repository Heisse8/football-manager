const express = require("express");
const Team = require("../models/Team");
const Transfer = require("../models/TransferMarket");
const { isTransferWindowOpen } = require("../utils/transferWindow");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================
   SPIELER AUKTION STARTEN
========================= */

router.post("/list", authMiddleware, async (req, res) => {

  if (!isTransferWindowOpen())
    return res.status(400).json({ message: "Transfermarkt geschlossen" });

  const { playerName, durationHours, startPrice, buyNowPrice } = req.body;

  if (!startPrice)
    return res.status(400).json({ message: "Startgebot ist Pflicht" });

  const team = await Team.findById(req.user.team);
  const player = team.players.find(p => p.name === playerName);

  if (!player)
    return res.status(404).json({ message: "Spieler nicht gefunden" });

  const expiresAt = new Date(Date.now() + durationHours * 60 * 60 * 1000);

  const transfer = await Transfer.create({
    playerId: player._id.toString(),
    playerName: player.name,
    fromTeam: team._id,
    startPrice,
    buyNowPrice,
    highestBid: startPrice,
    expiresAt
  });

  res.json({ message: "Auktion gestartet", transfer });
});

/* =========================
   ALLE OFFENEN AUKTIONEN
========================= */

router.get("/", async (req, res) => {

  const transfers = await Transfer.find({ status: "open" })
    .populate("fromTeam highestBidder");

  const formatted = transfers.map(t => ({
    id: t._id,
    player: t.playerName,
    fromTeam: t.fromTeam.name,
    startPrice: t.startPrice,
    highestBid: t.highestBid,
    highestBidder: t.highestBidder ? t.highestBidder.name : null,
    expiresAt: t.expiresAt,
    status: t.status
  }));

  res.json(formatted);
});

/* =========================
   GEBOT ABGEBEN
========================= */

router.post("/bid/:id", authMiddleware, async (req, res) => {

  if (!isTransferWindowOpen())
    return res.status(400).json({ message: "Transfermarkt geschlossen" });

  const { amount } = req.body;

  const transfer = await Transfer.findById(req.params.id);

  if (!transfer || transfer.status !== "open")
    return res.status(400).json({ message: "Auktion nicht verfügbar" });

  if (new Date() > transfer.expiresAt)
    return res.status(400).json({ message: "Auktion abgelaufen" });

  if (amount <= transfer.highestBid)
    return res.status(400).json({ message: "Gebot muss höher als aktuelles Höchstgebot sein" });

  const bidder = await Team.findById(req.user.team);

  if (bidder.budget < amount)
    return res.status(400).json({ message: "Nicht genug Budget" });

  transfer.highestBid = amount;
  transfer.highestBidder = bidder._id;

  transfer.bids.push({
    team: bidder._id,
    amount
  });

  // 🔥 Verlängerung bei Gebot < 60 Sekunden vor Ende
  const timeLeft = transfer.expiresAt - new Date();
  if (timeLeft < 60000) {
    transfer.expiresAt = new Date(Date.now() + 60000);
  }

  // Sofortkauf
  if (transfer.buyNowPrice && amount >= transfer.buyNowPrice) {
    transfer.expiresAt = new Date();
  }

  await transfer.save();

  res.json({ message: "Gebot erfolgreich", highestBid: transfer.highestBid });
});

module.exports = router;