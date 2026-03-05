const express = require("express");
const router = express.Router();

const News = require("../models/News");

/* =========================================
 NEWS LADEN
========================================= */

router.get("/", async (req,res)=>{

try{

const news = await News.find()
.sort({ createdAt:-1 })
.limit(50);

res.json(news);

}catch(err){

console.error(err);

res.status(500).json({message:"Serverfehler"});

}

});

module.exports = router;