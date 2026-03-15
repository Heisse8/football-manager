function applyTrainerStructure(ctx){

const style = ctx.style || "balanced"

let shape = {
buildUp: "4-3-3",
attackShape: "3-2-5",
restDefense: 3,
width:1,
tempo:1
}

switch(style){

case "possession":

shape.buildUp = "3-2"
shape.attackShape = "3-2-5"
shape.restDefense = 3
shape.width = 1.2
shape.tempo = 0.9

break

case "gegenpress":

shape.buildUp = "2-3"
shape.attackShape = "2-3-5"
shape.restDefense = 2
shape.width = 1.1
shape.tempo = 1.25

break

case "counter":

shape.buildUp = "4-2"
shape.attackShape = "3-3-4"
shape.restDefense = 4
shape.width = 1.0
shape.tempo = 1.35

break

case "parkbus":

shape.buildUp = "5-4"
shape.attackShape = "4-5-1"
shape.restDefense = 5
shape.width = 0.8
shape.tempo = 0.75

break

}

ctx.trainerStructure = shape

}

module.exports = { applyTrainerStructure }
