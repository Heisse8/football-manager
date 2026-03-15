const { simulateRealisticMatch } = require("./engines/matchEngine")

const players = [

{ _id:1, firstName:"GK", lastName:"Home", positions:["GK"], defending:70 },
{ _id:2, firstName:"CB1", lastName:"Home", positions:["CB"], defending:65 },
{ _id:3, firstName:"CB2", lastName:"Home", positions:["CB"], defending:65 },
{ _id:4, firstName:"LB", lastName:"Home", positions:["LB"], defending:60 },
{ _id:5, firstName:"RB", lastName:"Home", positions:["RB"], defending:60 },

{ _id:6, firstName:"CM1", lastName:"Home", positions:["CM"], passing:65 },
{ _id:7, firstName:"CM2", lastName:"Home", positions:["CM"], passing:65 },
{ _id:8, firstName:"CAM", lastName:"Home", positions:["CAM"], passing:70 },

{ _id:9, firstName:"LW", lastName:"Home", positions:["LW"], pace:70 },
{ _id:10, firstName:"RW", lastName:"Home", positions:["RW"], pace:70 },
{ _id:11, firstName:"ST", lastName:"Home", positions:["ST"], shooting:72 }

]

async function run(){

const homeTeam = {
attackStrength:65,
defenseStrength:60,
possessionSkill:62,
tacticalStyle:"possession",
stadiumCapacity:40000,
attendance:35000
}

const awayTeam = {
attackStrength:60,
defenseStrength:58,
possessionSkill:55,
tacticalStyle:"counter"
}

const result = await simulateRealisticMatch({
homeTeam,
awayTeam,
homePlayers:players,
awayPlayers:players,
homeCoach:{},
awayCoach:{},
match:{ type:"league" }
})

console.log(JSON.stringify(result,null,2))

}

run()