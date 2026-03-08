function getFormationSlots(formation){

const formations = {

"442":[
"GK",
"LB","CB","CB","RB",
"LM","CM","CM","RM",
"ST","ST"
],

"433":[
"GK",
"LB","CB","CB","RB",
"CM","CM","CM",
"LW","ST","RW"
],

"4231":[
"GK",
"LB","CB","CB","RB",
"CDM","CDM",
"LW","CAM","RW",
"ST"
],

"41212":[
"GK",
"LB","CB","CB","RB",
"CDM",
"CM","CM",
"CAM",
"ST","ST"
],

"352":[
"GK",
"CB","CB","CB",
"LM","CM","CM","RM",
"CAM",
"ST","ST"
]

};

return formations[formation] || formations["442"];

}

module.exports = { getFormationSlots };