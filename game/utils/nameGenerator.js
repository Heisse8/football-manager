function generateCoachName(firstName, lastName){

const changes = [
n => n + "r",
n => n + "o",
n => n.replace(/o/g,"a"),
n => n.replace(/e/g,"a"),
n => n.slice(0,-1),
n => n + "i"
]

const change = changes[Math.floor(Math.random()*changes.length)]

return {
firstName,
lastName: change(lastName)
}

}

module.exports = { generateCoachName }
