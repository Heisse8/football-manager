async function applySponsorSeasonBonus(team){

if(!team.sponsorBonus) return;

const position = team.tablePosition;

if(position <= 3 && team.sponsorBonus.champion){

team.balance += team.sponsorBonus.champion;

}

else if(position <= 5 && team.sponsorBonus.top5){

team.balance += team.sponsorBonus.top5;

}

else if(position <= 10 && team.sponsorBonus.top10){

team.balance += team.sponsorBonus.top10;

}

await team.save();

}