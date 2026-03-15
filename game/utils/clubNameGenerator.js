const prefixes = [

"FC",
"SC",
"SV",
"TSV",
"VfB",
"VfL",
"SpVgg",
"Borussia",
"Union",
"Eintracht"

];

const cities = [

/* Deutschland */

"Augsburg",
"Rosenheim",
"Koblenz",
"Lübeck",
"Ingolstadt",
"Regensburg",
"Heidenheim",
"Osnabrück",
"Saarbrücken",
"Ulm",
"Chemnitz",
"Jena",
"Magdeburg",
"Essen",
"Oldenburg",

/* England */

"Blackburn",
"Derby",
"Preston",
"Bolton",
"Reading",
"Huddersfield",
"Coventry",

/* Spanien */

"Girona",
"Zaragoza",
"Malaga",
"Cadiz",
"Gijon",
"Granada",

/* Italien */

"Parma",
"Bari",
"Palermo",
"Pisa",
"Como",
"Modena",

/* Frankreich */

"Metz",
"Caen",
"Troyes",
"Brest",
"Lorient",
"Nancy"

];

function generateClubName(){

const prefix = prefixes[Math.floor(Math.random()*prefixes.length)];
const city = cities[Math.floor(Math.random()*cities.length)];

const name = `${prefix} ${city} 🤖`;

const shortName = city.slice(0,3).toUpperCase();

return { name, shortName };

}

module.exports = { generateClubName };