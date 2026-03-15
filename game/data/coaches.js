const coaches = [

/* =========================
ELITE
========================= */

{firstName:"Pep",lastName:"Guardiola",identityKey:"guardiola",stars:5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"possession_master",tactics:97,motivation:86,discipline:82},
{firstName:"Carlo",lastName:"Ancelotti",identityKey:"ancelotti",stars:5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"tactical_genius",tactics:94,motivation:88,discipline:86},
{firstName:"Jupp",lastName:"Heynckes",stars:5,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"tactical_genius",tactics:95,motivation:90,discipline:90},
{firstName:"Ottmar",lastName:"Hitzfeld",stars:5,philosophy:"konter",preferredFormation:"4-4-2",personality:"tactical_genius",tactics:95,motivation:90,discipline:92},

/* =========================
WORLD CLASS
========================= */

{firstName:"Diego",lastName:"Simeone",identityKey:"simeone",stars:4.5,philosophy:"defensiv",preferredFormation:"5-3-2",personality:"defensive_wall",tactics:92,motivation:94,discipline:90},
{firstName:"Xabi",lastName:"Alonso",identityKey:"xabi_alonso",stars:4.5,philosophy:"ballbesitz",preferredFormation:"3-4-2-1",personality:"tactical_genius",tactics:92,motivation:90,discipline:84},
{firstName:"Thomas",lastName:"Tuchel",identityKey:"tuchel",stars:4.5,philosophy:"gegenpressing",preferredFormation:"3-4-2-1",personality:"tactical_genius",tactics:93,motivation:84,discipline:85},
{firstName:"Luis",lastName:"Enrique",identityKey:"luis_enrique",stars:4.5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"possession_master",tactics:92,motivation:86,discipline:80},
{firstName:"Didier",lastName:"Deschamps",stars:4.5,philosophy:"konter",preferredFormation:"4-2-3-1",personality:"balanced",tactics:90,motivation:88,discipline:87},
{firstName:"Roberto",lastName:"De Zerbi",identityKey:"de_zerbi",stars:4.5,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"possession_master",tactics:92,motivation:85,discipline:78},
{firstName:"Unai",lastName:"Emery",identityKey:"emery",stars:4.5,philosophy:"konter",preferredFormation:"4-2-3-1",personality:"tactical_genius",tactics:91,motivation:87,discipline:85},
{firstName:"Hansi",lastName:"Flick",identityKey:"flick",stars:4.5,philosophy:"gegenpressing",preferredFormation:"4-2-3-1",personality:"gegenpress_monster",tactics:91,motivation:90,discipline:82},

/* =========================
TOP TRAINER
========================= */

{firstName:"Mikel",lastName:"Arteta",identityKey:"arteta",stars:4.5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"tactical_genius",tactics:91,motivation:88,discipline:84},
{firstName:"Arne",lastName:"Slot",identityKey:"slot",stars:4.5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"possession_master",tactics:90,motivation:87,discipline:80},
{firstName:"Oliver",lastName:"Glasner",stars:4,philosophy:"gegenpressing",preferredFormation:"3-4-2-1",personality:"balanced",tactics:86,motivation:87,discipline:82},
{firstName:"Marco",lastName:"Rose",stars:4,philosophy:"gegenpressing",preferredFormation:"4-2-3-1",personality:"balanced",tactics:85,motivation:86,discipline:80},
{firstName:"Enzo",lastName:"Maresca",identityKey:"maresca",stars:4,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"possession_master",tactics:86,motivation:84,discipline:78},
{firstName:"Thomas",lastName:"Frank",stars:4,philosophy:"konter",preferredFormation:"3-5-2",personality:"balanced",tactics:85,motivation:88,discipline:82},
{firstName:"Eddie",lastName:"Howe",stars:4,philosophy:"gegenpressing",preferredFormation:"4-3-3",personality:"balanced",tactics:85,motivation:86,discipline:80},
{firstName:"Marco",lastName:"Silva",stars:4,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"balanced",tactics:84,motivation:85,discipline:80},
{firstName:"Daniel",lastName:"Farke",stars:4,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"possession_master",tactics:84,motivation:83,discipline:80},
{firstName:"Michael",lastName:"Carrick",identityKey:"carrick",stars:4,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"balanced",tactics:84,motivation:84,discipline:80},

/* =========================
BUNDESLIGA / EUROPE
========================= */

{firstName:"Vincent",lastName:"Kompany",identityKey:"kompany",stars:4.5,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"tactical_genius",tactics:90,motivation:87,discipline:82},
{firstName:"Sebastian",lastName:"Hoeneß",stars:4,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"balanced",tactics:86,motivation:85,discipline:82},
{firstName:"Ole",lastName:"Werner",stars:4,philosophy:"ballbesitz",preferredFormation:"3-5-2",personality:"balanced",tactics:85,motivation:85,discipline:82},
{firstName:"Niko",lastName:"Kovac",stars:4,philosophy:"gegenpressing",preferredFormation:"4-2-3-1",personality:"balanced",tactics:85,motivation:88,discipline:85},
{firstName:"Tim",lastName:"Walter",stars:3.5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"direct_play",tactics:82,motivation:86,discipline:78},
{firstName:"Frank",lastName:"Schmidt",stars:4,philosophy:"konter",preferredFormation:"4-2-3-1",personality:"balanced",tactics:84,motivation:90,discipline:86},
{firstName:"Steffen",lastName:"Baumgart",stars:4,philosophy:"gegenpressing",preferredFormation:"4-2-3-1",personality:"gegenpress_monster",tactics:84,motivation:92,discipline:82},
{firstName:"Christian",lastName:"Ilzer",stars:4,philosophy:"gegenpressing",preferredFormation:"4-4-2",personality:"balanced",tactics:84,motivation:86,discipline:82},
{firstName:"Daniel",lastName:"Thioune",stars:3.5,philosophy:"gegenpressing",preferredFormation:"4-2-3-1",personality:"balanced",tactics:80,motivation:86,discipline:82},
{firstName:"Urs",lastName:"Fischer",stars:4,philosophy:"defensiv",preferredFormation:"3-5-2",personality:"defensive_wall",tactics:85,motivation:86,discipline:88},

/* =========================
SOLID TRAINER
========================= */

{firstName:"Dieter",lastName:"Hecking",stars:3.5,philosophy:"konter",preferredFormation:"4-2-3-1",personality:"balanced",tactics:80,motivation:82,discipline:84},
{firstName:"Florian",lastName:"Kohfeldt",stars:3.5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"balanced",tactics:78,motivation:82,discipline:78},
{firstName:"Miron",lastName:"Muslic",stars:3.5,philosophy:"gegenpressing",preferredFormation:"4-3-3",personality:"balanced",tactics:80,motivation:84,discipline:82},
{firstName:"Stefan",lastName:"Leitl",stars:3.5,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"balanced",tactics:80,motivation:84,discipline:82},
{firstName:"Markus",lastName:"Anfang",stars:3.5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"balanced",tactics:78,motivation:82,discipline:80},
{firstName:"Christian",lastName:"Eichner",stars:3.5,philosophy:"konter",preferredFormation:"4-4-2",personality:"balanced",tactics:80,motivation:85,discipline:84},
{firstName:"Torsten",lastName:"Lieberknecht",stars:3.5,philosophy:"gegenpressing",preferredFormation:"4-2-3-1",personality:"balanced",tactics:80,motivation:88,discipline:84},
{firstName:"Christian",lastName:"Titz",stars:3.5,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"balanced",tactics:80,motivation:84,discipline:82},

/* =========================
REST (COACH POOL)
========================= */

{firstName:"Petrik",lastName:"Sander",stars:3,philosophy:"konter",preferredFormation:"4-2-3-1",personality:"balanced",tactics:76,motivation:80,discipline:80},
{firstName:"Heiko",lastName:"Vogel",stars:3,philosophy:"konter",preferredFormation:"4-2-3-1",personality:"balanced",tactics:76,motivation:80,discipline:80},
{firstName:"Miroslav",lastName:"Klose",stars:3.5,philosophy:"ballbesitz",preferredFormation:"4-2-3-1",personality:"balanced",tactics:80,motivation:85,discipline:80},
{firstName:"Igor",lastName:"Tudor",stars:4,philosophy:"gegenpressing",preferredFormation:"3-4-2-1",personality:"balanced",tactics:84,motivation:85,discipline:82},
{firstName:"Vitor",lastName:"Pereira",stars:4,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"balanced",tactics:85,motivation:84,discipline:80},
{firstName:"Ronald",lastName:"Koeman",stars:4,philosophy:"ballbesitz",preferredFormation:"4-3-3",personality:"balanced",tactics:86,motivation:82,discipline:82}

]

module.exports = coaches
