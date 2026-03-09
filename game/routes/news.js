const express = require("express");
const router = express.Router();

const News = require("../models/News");

/* =========================================
 NEWS LADEN
 GET /api/news
========================================= */

router.get("/", async (req,res)=>{

try{

/* Pagination */

const limit = parseInt(req.query.limit) || 20;
const page = parseInt(req.query.page) || 1;

const skip = (page - 1) * limit;

/* News laden */

const news = await News.find()
.select("title content league team type importance createdAt")
.sort({ createdAt:-1 })
.skip(skip)
.limit(limit)
.lean();

/* Gesamtanzahl */

const total = await News.countDocuments();

/* Response */

res.json({
news,
page,
pages: Math.ceil(total / limit),
total
});

}catch(err){

console.error("News Fehler:",err);

res.status(500).json({
message:"Serverfehler"
});

}

});

module.exports = router;