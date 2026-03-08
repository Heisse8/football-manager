function generateScoutPlayers(stars){

const players=[];

const count = Math.floor(Math.random()*3)+1;

for(let i=0;i<count;i++){

const rating = generateStarRating(stars);

players.push({
stars:rating,
age:16+Math.floor(Math.random()*8),
position:randomPosition()
});

}

return players;

}

function generateStarRating(scoutStars){

const r=Math.random();

if(scoutStars===1){

if(r<0.6) return 1;
if(r<0.9) return 2;
return 3;

}

if(scoutStars===2){

if(r<0.4) return 2;
if(r<0.8) return 3;
return 3.5;

}

if(scoutStars===3){

if(r<0.4) return 3;
if(r<0.75) return 3.5;
return 4;

}

if(scoutStars===4){

if(r<0.4) return 3.5;
if(r<0.8) return 4;
return 4.5;

}

if(scoutStars===5){

if(r<0.3) return 4;
if(r<0.7) return 4.5;
if(r<0.95) return 4.8;
return 5;

}

}

function randomPosition(){

const positions=[
"ST","LW","RW","CAM",
"CM","CDM",
"CB","LB","RB",
"GK"
];

return positions[Math.floor(Math.random()*positions.length)];

}

module.exports={generateScoutPlayers};