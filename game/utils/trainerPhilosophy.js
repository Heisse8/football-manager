function generateTrainerPhilosophy(type){

const philosophies = {

gegenpress: {
pressing: 85,
tempo: 80,
width: 65,
defensiveLine: 75,
counter: 60,
possession: 55
},

possession: {
pressing: 65,
tempo: 60,
width: 80,
defensiveLine: 70,
counter: 30,
possession: 90
},

defensive: {
pressing: 45,
tempo: 45,
width: 50,
defensiveLine: 40,
counter: 80,
possession: 40
},

balanced: {
pressing: 60,
tempo: 60,
width: 60,
defensiveLine: 60,
counter: 60,
possession: 60
}

};

return philosophies[type] || philosophies.balanced;

}

module.exports = { generateTrainerPhilosophy };