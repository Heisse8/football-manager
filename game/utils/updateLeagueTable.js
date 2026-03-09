async function updateScorers(match){

if(!match.events) return;

for(const event of match.events){

if(event.type !== "goal") continue;

/* Tor */

await Player.updateOne(
{ _id: event.player },
{ $inc: { "seasonStats.goals": 1 } }
);

/* Assist */

if(event.assist){

await Player.updateOne(
{ _id: event.assist },
{ $inc: { "seasonStats.assists": 1 } }
);

}

}

}