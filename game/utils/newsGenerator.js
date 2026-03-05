const News = require("../models/News");
const Team = require("../models/Team");

async function generateMatchNews(match){

const homeTeam = match.homeTeam.name;
const awayTeam = match.awayTeam.name;

const homeGoals = match.homeGoals;
const awayGoals = match.awayGoals;

let title;
let content;

if(homeGoals > awayGoals){

title = `${homeTeam} besiegt ${awayTeam}`;

content = `${homeTeam} gewinnt mit ${homeGoals}:${awayGoals} gegen ${awayTeam}.`;

}
else if(awayGoals > homeGoals){

title = `${awayTeam} gewinnt bei ${homeTeam}`;

content = `${awayTeam} setzt sich mit ${awayGoals}:${homeGoals} durch.`;

}
else{

title = `Remis zwischen ${homeTeam} und ${awayTeam}`;

content = `${homeTeam} und ${awayTeam} trennen sich ${homeGoals}:${awayGoals}.`;

}

await News.create({

title,
content,
type:"match",
league:match.league

});

}

async function generateTeamCrisisNews(){

const teams = await Team.find();

for(const team of teams){

if(team.losses >= 3){

await News.create({

title:`Trainer bei ${team.name} unter Druck`,

content:`${team.name} hat mehrere Niederlagen in Folge kassiert. Steht der Trainer vor dem Aus?`,

type:"team",

team:team._id

});

}

}

}

module.exports = {
generateMatchNews,
generateTeamCrisisNews
};