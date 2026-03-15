const usedNames = new Set()

function mutateLastName(lastName){

let name = lastName.toLowerCase()

/* Umlaute ersetzen */

name = name
.replace(/ö/g,"oe")
.replace(/ü/g,"ue")
.replace(/ä/g,"ae")

/* Mutationen */

const mutations = [

n => n + "a",
n => n + "er",
n => n + "in",
n => n.replace(/o/g,"a"),
n => n.replace(/e/g,"a"),
n => n.slice(0,-1),
n => n + "o",
n => n + "i"

]

const mutate = mutations[Math.floor(Math.random()*mutations.length)]

name = mutate(name)

/* erster Buchstabe groß */

return name.charAt(0).toUpperCase() + name.slice(1)

}

function generateCoachName(firstName,lastName){

let newLastName = mutateLastName(lastName)

/* doppelte Namen verhindern */

let fullName = firstName + " " + newLastName

while(usedNames.has(fullName)){

newLastName = mutateLastName(lastName)
fullName = firstName + " " + newLastName

}

usedNames.add(fullName)

return {
firstName,
lastName:newLastName
}

}

module.exports = { generateCoachName }
