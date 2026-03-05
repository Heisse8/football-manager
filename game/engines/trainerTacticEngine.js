function generateTactics(trainer){

switch(trainer.playStyle){

case "gegenpressing":

return{
pressing:"sehr_hoch",
tempo:"hoch",
mentality:"offensiv"
};

case "konter":

return{
pressing:"mittel",
tempo:"hoch",
mentality:"defensiv"
};

case "defensiv":

return{
pressing:"low_block",
tempo:"langsam",
mentality:"defensiv"
};

case "ballbesitz":

default:

return{
pressing:"hoch",
tempo:"kontrolliert",
mentality:"ausgewogen"
};

}

}

module.exports={generateTactics};