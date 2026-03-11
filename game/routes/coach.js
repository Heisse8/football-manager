router.post("/buy/:id", auth, async (req,res)=>{

try{

const coach = await Coach.findById(req.params.id);
const team = await Team.findOne({ owner:req.user.userId });

if(!coach || !coach.isListed){
return res.status(400).json({ message:"Trainer nicht verfügbar" });
}

if(team.balance < coach.transferPrice){
return res.status(400).json({ message:"Zu wenig Geld" });
}

/* alter Trainer freigeben */

await Coach.updateMany(
{ team:team._id },
{ team:null, isListed:true }
);

/* Trainer kaufen */

coach.team = team._id;
coach.isListed = false;
coach.sellerTeam = null;

await coach.save();

/* Geld abziehen */

team.balance -= coach.transferPrice;

await team.save();

res.json({
message:"Trainer verpflichtet",
coach
});

}catch(err){

res.status(500).json({ message:"Serverfehler" });

}

});