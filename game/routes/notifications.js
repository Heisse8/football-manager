const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const Notification = require("../models/Notification");

/* =========================================
 NOTIFICATION COUNT
 GET /api/notifications/count
========================================= */

router.get("/count", auth, async (req,res)=>{

try{

const count = await Notification.countDocuments({
user: req.user.userId,
isRead: false
});

res.json({
count
});

}catch(err){

console.error("Notification Count Fehler:", err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;