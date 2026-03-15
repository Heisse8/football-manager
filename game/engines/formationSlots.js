function getFormationSlots(formation){

switch(formation){

case "433":
return [
"GK",
"LB","CB","CB","RB",
"CM","CM","CAM",
"LW","RW",
"ST"
]

case "4231":
return [
"GK",
"LB","CB","CB","RB",
"CDM","CDM",
"LW","CAM","RW",
"ST"
]

case "442":
default:
return [
"GK",
"LB","CB","CB","RB",
"LM","CM","CM","RM",
"ST","ST"
]

}

}

module.exports = { getFormationSlots }