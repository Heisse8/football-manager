function selectBestFormation(players){

let strikers = 0;
let wingers = 0;
let cams = 0;

players.forEach(p=>{

const pos = p.positions || [];

if(pos.includes("ST")) strikers++;
if(pos.includes("LW") || pos.includes("RW")) wingers++;
if(pos.includes("CAM")) cams++;

});

/* ================= ENTSCHEIDUNG ================= */

if(strikers >= 2){
return "4-4-2";
}

if(strikers >=1 && wingers >=2){
return "4-3-3";
}

if(strikers >=1 && cams >=1){
return "4-2-3-1";
}

return "3-5-2";

}

module.exports = { selectBestFormation };