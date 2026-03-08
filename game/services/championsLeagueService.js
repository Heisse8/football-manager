const Team = require("../models/Team");
const Match = require("../models/Match");

const { payGroupStage } = require("./championsLeaguePrizeService");

/* =====================================================
CHAMPIONS LEAGUE STARTEN
===================================================== */

async function generateChampionsLeague(){

const leagues = ["GER_1","ENG_1","ESP_1","ITA_1"];

let pot1=[];
let pot2=[];
let pot3=[];
let pot4=[];

/* =====================================================
TOP 4 JE LIGA
===================================================== */

for(const league of leagues){

const table = await Team.find({ league })
.sort({ points:-1, goalDifference:-1, goalsFor:-1 });

pot1.push(table[0]);
pot2.push(table[1]);
pot3.push(table[2]);
pot4.push(table[3]);

}

/* =====================================================
GRUPPEN ERSTELLEN
===================================================== */

const groups={
A:[],
B:[],
C:[],
D:[]
};

/* Pot1 fix verteilen */

groups.A.push(pot1[0]);
groups.B.push(pot1[1]);
groups.C.push(pot1[2]);
groups.D.push(pot1[3]);

shuffle(pot2);
shuffle(pot3);
shuffle(pot4);

/* restliche Pots */

for(let i=0;i<4;i++){

addTeamToGroup(groups,i,pot2[i]);
addTeamToGroup(groups,i,pot3[i]);
addTeamToGroup(groups,i,pot4[i]);

}

/* =====================================================
STARTGELD AUSZAHLEN
===================================================== */

for(const group of Object.values(groups)){

for(const team of group){

await payGroupStage(team);

}

}

/* =====================================================
GRUPPENSPIELE ERSTELLEN
===================================================== */

await generateGroupMatches(groups);

console.log("Champions League Gruppen erstellt");

}

/* =====================================================
GRUPPENSPIELE
===================================================== */

async function generateGroupMatches(groups){

const groupNames=["A","B","C","D"];

for(const g of groupNames){

const teams = groups[g];

for(let i=0;i<teams.length;i++){

for(let j=i+1;j<teams.length;j++){

const home = teams[i];
const away = teams[j];

const date1 = getNextThursday();
const date2 = getNextThursday(7);

await Match.create({

homeTeam:home._id,
awayTeam:away._id,

competition:"ucl",
group:g,
leg:1,

date:date1,
played:false

});

await Match.create({

homeTeam:away._id,
awayTeam:home._id,

competition:"ucl",
group:g,
leg:2,

date:date2,
played:false

});

}

}

}

}

/* =====================================================
KO PHASE AUSLOSUNG
===================================================== */

function drawKnockout(first,second){

const matches=[];

shuffle(second);

for(const team of first){

let opponent = second.find(
t => t.group !== team.group
);

if(!opponent){
opponent = second[0];
}

matches.push({
home:team,
away:opponent
});

second = second.filter(
t => t._id.toString() !== opponent._id.toString()
);

}

return matches;

}

/* =====================================================
KO MATCHES ERSTELLEN
===================================================== */

async function createKnockoutMatches(first,second,round){

const pairs = drawKnockout(first,second);

for(const p of pairs){

const date1 = getNextThursday();
const date2 = getNextThursday(7);

await Match.create({

homeTeam:p.home._id,
awayTeam:p.away._id,

competition:"ucl",
cupRound:round,
leg:1,

date:date1,
played:false

});

await Match.create({

homeTeam:p.away._id,
awayTeam:p.home._id,

competition:"ucl",
cupRound:round,
leg:2,

date:date2,
played:false

});

}

}

/* =====================================================
TEAM ZU GRUPPE HINZUFÜGEN
===================================================== */

function addTeamToGroup(groups,index,team){

const keys=["A","B","C","D"];

let groupKey = keys[index];

/* gleiche Liga verhindern */

if(groups[groupKey].some(t => t.league === team.league)){

for(const k of keys){

if(!groups[k].some(t => t.league === team.league)){

groups[k].push(team);
return;

}

}

}

/* fallback */

groups[groupKey].push(team);

}

/* =====================================================
UTIL SHUFFLE
===================================================== */

function shuffle(array){

for(let i=array.length-1;i>0;i--){

const j=Math.floor(Math.random()*(i+1));

[array[i],array[j]]=[array[j],array[i]];

}

return array;

}

/* =====================================================
NÄCHSTER DONNERSTAG
===================================================== */

function getNextThursday(offset=0){

const now=new Date();

const day=now.getDay();

const diff=(4-day+7)%7 || 7;

now.setDate(now.getDate()+diff+offset);

return now;

}

/* =====================================================
EXPORT
===================================================== */

module.exports = {

generateChampionsLeague,
createKnockoutMatches,
drawKnockout

};