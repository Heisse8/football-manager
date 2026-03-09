function generateTactics(trainer){

const style = trainer?.playStyle || "ballbesitz";

switch(style){

/* =====================================================
GEGENPRESSING
===================================================== */

case "gegenpressing":

return{

playStyle:"gegenpressing",

pressing:"sehr_hoch",
defensiveLine:"hoch",

passingStyle:"kurz",
tempo:"sehr_hoch",
width:"normal",

transitionAfterWin:"vertikal",
transitionAfterLoss:"gegenpressing",

mentality:"offensiv"

};


/* =====================================================
KONTER
===================================================== */

case "konter":

return{

playStyle:"konter",

pressing:"mittel",
defensiveLine:"tief",

passingStyle:"lang",
tempo:"hoch",
width:"breit",

transitionAfterWin:"vertikal",
transitionAfterLoss:"rueckzug",

mentality:"defensiv"

};


/* =====================================================
DEFENSIV
===================================================== */

case "defensiv":

return{

playStyle:"mauern",

pressing:"low_block",
defensiveLine:"tief",

passingStyle:"lang",
tempo:"langsam",
width:"eng",

transitionAfterWin:"kontrolliert",
transitionAfterLoss:"rueckzug",

mentality:"defensiv"

};


/* =====================================================
BALLBESITZ
===================================================== */

case "ballbesitz":
default:

return{

playStyle:"ballbesitz",

pressing:"hoch",
defensiveLine:"mittel",

passingStyle:"kurz",
tempo:"kontrolliert",
width:"breit",

transitionAfterWin:"kontrolliert",
transitionAfterLoss:"mittelfeldpressing",

mentality:"ausgewogen"

};

}

}

module.exports = { generateTactics };