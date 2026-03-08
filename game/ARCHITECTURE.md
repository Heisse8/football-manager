# Football Manager – Backend Architecture

## Server
Startpunkt des Backends

server.js

---

## Authentication
Login / Registrierung

routes/auth.js  
middleware/auth.js  
models/User.js

---

## Teams

routes/team.js  
models/Team.js

---

## Stadion System

routes/stadium.js  
models/Stadium.js  
utils/matchRevenue.js

---

## Match System

routes/match.js  
engines/matchEngine.js  
engines/simulateRealisticMatch.js  
services/matchdaySimulator.js  

---

## Transfersystem

routes/transfer.js  
models/Transfer.js  
utils/transferResolver.js

---

## Sponsoring

routes/sponsor.js  
utils/sponsorGenerator.js  
utils/sponsorSeasonBonus.js

---

## News System

routes/news.js  
models/News.js  
utils/newsGenerator.js

---

## Liga & Saison

routes/league.js  
routes/season.js  
utils/seasonScheduler.js  
utils/promotionRelegation.js