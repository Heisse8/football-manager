function calculateCoachPrice(coach){

const baseByStars = {
2: 500000,
3: 2000000,
4: 5500000,
5: 9000000
};

let price = baseByStars[coach.stars] || 1000000;

const quality =
(coach.tactics + coach.motivation + coach.discipline) / 3;

price *= (0.85 + quality / 120);

// Markt‑Variation
price *= (0.9 + Math.random()*0.2);

return Math.round(price);
}

module.exports = { calculateCoachPrice };
