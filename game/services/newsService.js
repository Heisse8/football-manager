const News = require("../models/News");

async function createNews(data){

await News.create({
title:data.title,
content:data.content,
league:data.league || null,
team:data.team || null,
type:data.type || "match",
importance:data.importance || 1
});

}

module.exports = { createNews }; 