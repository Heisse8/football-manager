const fs = require("fs")

const rawPlayers =
require("../data/rawBundesligaPlayers.json")

function random(min,max){
return Math.floor(Math.random()*(max-min+1))+min
}

/* ===============================
NAME MODIFIER
=============================== */

function modifyName(name){

const parts = name.split(" ")

const first = parts[0]

let last = parts.slice(1).join("")

// letzten Buchstaben ändern
const lastChar = last.charCodeAt(last.length-1)

last =
last.slice(0,-1) +
String.fromCharCode(lastChar+1)

return {
firstName:first,
lastName:last
}

}

/* ===============================
PLAYSTYLE BY POSITION
=============================== */

function generatePlaystyles(pos){

switch(pos){

case "ST":
return ["poacher"]

case "CAM":
return ["playmaker_cam"]

case "CM":
return ["box_to_box"]

case "CDM":
return ["anchor_man"]

case "CB":
return ["stopper_cb"]

case "RB":
case "LB":
return ["wingback"]

case "LW":
case "RW":
return ["inside_forward"]

case "GK":
return ["shot_stopper"]

default:
return []

}

}

/* ===============================
ATTRIBUTE GENERATOR
=============================== */

function generateAttributes(pos){

if(pos==="ST"){

return{
pace:random(70,90),
shooting:random(80,95),
passing:random(60,80),
dribbling:random(70,88),
defending:random(30,50),
physical:random(70,90),
mentality:random(70,90)
}

}

if(pos==="CB"){

return{
pace:random(60,80),
shooting:random(30,50),
passing:random(60,80),
dribbling:random(50,65),
defending:random(80,95),
physical:random(80,95),
mentality:random(75,90)
}

}

if(pos==="CAM"){

return{
pace:random(70,90),
shooting:random(70,85),
passing:random(80,95),
dribbling:random(80,95),
defending:random(40,60),
physical:random(60,75),
mentality:random(75,90)
}

}

return{

pace:random(65,85),
shooting:random(60,80),
passing:random(70,85),
dribbling:random(65,85),
defending:random(60,80),
physical:random(65,85),
mentality:random(70,85)

}

}

/* ===============================
STAR CALCULATION
=============================== */

function calculateStars(attrs){

const avg =
(
attrs.pace+
attrs.shooting+
attrs.passing+
attrs.dribbling+
attrs.defending+
attrs.physical+
attrs.mentality
)/7

let stars = avg/20

return Math.round(stars*2)/2

}

/* ===============================
GENERATION
=============================== */

const players=[]

for(const p of rawPlayers){

const name=modifyName(p.name)

const attrs=generateAttributes(p.position)

const stars=calculateStars(attrs)

players.push({

firstName:name.firstName,
lastName:name.lastName,

nationality:p.nationality,

age:p.age,

positions:[p.position],

playstyles:generatePlaystyles(p.position),

stars:stars,

potential:Math.min(5,stars+1),

...attrs

})

}

fs.writeFileSync(

"./data/bundesligaPlayers.json",

JSON.stringify(players,null,2)

)

console.log("Players generated:",players.length)
