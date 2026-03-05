function generatePlayStyle(position){

switch(position){

case "ST":

return Math.random() < 0.6
? "finisher"
: "targetman";

case "LW":
case "RW":

return "winger";

case "CAM":

return "playmaker";

case "CM":

return Math.random() < 0.5
? "box_to_box"
: "playmaker";

case "CDM":

return "ball_winner";

case "GK":

return Math.random() < 0.3
? "sweeper_keeper"
: null;

default:
return null;

}

}

module.exports = { generatePlayStyle };