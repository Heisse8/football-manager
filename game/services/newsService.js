const News = require("../models/News");

/* =====================================================
NEWS ERSTELLEN
===================================================== */

async function createNews(data){

if(!data.title || !data.content){
return;
}

await News.create({

title: data.title,
content: data.content,

league: data.league || null,
team: data.team || null,

type: data.type || "match",

importance: data.importance || 1,

createdAt: new Date()

});

}

module.exports = { createNews };