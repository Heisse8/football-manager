function generatePlaystyle(position){

const map = {

ST:["finisher","targetman","poacher"],

LW:["winger","finisher"],
RW:["winger","finisher"],

CAM:["playmaker","box_to_box"],

CM:["box_to_box","deep_playmaker"],
CDM:["ball_winner","deep_playmaker"],

CB:["defensive_wall"],
LB:["winger","ball_winner"],
RB:["winger","ball_winner"],

GK:["sweeper_keeper"]

};

const options = map[position] || ["box_to_box"];

return options[Math.floor(Math.random()*options.length)];

}

module.exports = { generatePlaystyle };