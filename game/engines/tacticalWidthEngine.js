function applyTacticalWidth(ctx){

let width = 1

switch(ctx.style){

case "possession":
width = 1.25
break

case "gegenpress":
width = 1.10
break

case "counter":
width = 0.95
break

case "parkbus":
width = 0.80
break

case "longball":
width = 1.05
break

}

return width

}

module.exports = { applyTacticalWidth }