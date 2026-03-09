const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const sgMail = require("@sendgrid/mail");
const rateLimit = require("express-rate-limit");

const User = require("../models/User");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


/* =====================================================
LOGIN RATE LIMIT
max 5 Versuche pro Minute
===================================================== */

const loginLimiter = rateLimit({
windowMs: 60 * 1000,
max: 5,
message: {
message: "Zu viele Loginversuche. Bitte später erneut versuchen."
}
});


/* =====================================================
TOKEN HELPERS
===================================================== */

function generateAccessToken(user){

return jwt.sign(
{
userId: user._id,
username: user.username
},
process.env.JWT_SECRET,
{
expiresIn: "15m"
}
);

}

function generateRefreshToken(user){

return jwt.sign(
{
userId: user._id
},
process.env.JWT_REFRESH_SECRET,
{
expiresIn: "30d"
}
);

}


/* =====================================================
REGISTER
===================================================== */

router.post("/register", async (req, res) => {

const { username, email, password } = req.body;

try {

/* Passwort prüfen */

if(password.length < 6){
return res.status(400).json({
message: "Passwort muss mindestens 6 Zeichen haben"
});
}

/* Doppelprüfung */

const existingUser = await User.findOne({
$or: [
{ email },
{ username }
]
});

if(existingUser){
return res.status(400).json({
message: "Email oder Username bereits vergeben"
});
}

/* Passwort hashen */

const hashedPassword = await bcrypt.hash(password, 10);

/* Verification Token */

const verificationToken = crypto.randomBytes(64).toString("hex");

/* User erstellen */

const newUser = new User({
username,
email,
password: hashedPassword,
verificationToken,
isVerified: false
});

await newUser.save();

/* Email senden */

const verificationLink =
`https://football-manager-2.onrender.com/api/auth/verify/${verificationToken}`;

await sgMail.send({
to: email,
from: process.env.EMAIL_USER,
subject: "Bestätige deinen Football Manager Account ⚽",
html: `
<h2>Willkommen beim Football Manager ⚽</h2>
<p>Klicke auf den Link um deinen Account zu bestätigen:</p>
<a href="${verificationLink}">${verificationLink}</a>
`
});

res.status(201).json({
message: "Bestätigungsmail wurde gesendet!"
});

} catch (err) {

console.error("Register Fehler:", err);

res.status(500).json({
message: "Serverfehler"
});

}

});


/* =====================================================
VERIFY EMAIL
===================================================== */

router.get("/verify/:token", async (req, res) => {

try {

const user = await User.findOne({
verificationToken: req.params.token
});

if(!user){
return res.status(400).send("Ungültiger Token");
}

/* Account aktivieren */

user.isVerified = true;
user.verificationToken = null;

await user.save();

/* Tokens */

const accessToken = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);

/* Refresh Token speichern */

user.refreshToken = refreshToken;
await user.save();

/* Redirect zum Frontend */

res.redirect(
`https://football-manager-2.onrender.com/verify-success?token=${accessToken}&refresh=${refreshToken}`
);

} catch (err) {

console.error("Verify Fehler:", err);

res.status(500).send("Serverfehler");

}

});


/* =====================================================
LOGIN
===================================================== */

router.post("/login", loginLimiter, async (req, res) => {

const { email, password } = req.body;

try {

const user = await User.findOne({ email });

if(!user){
return res.status(400).json({
message: "User nicht gefunden"
});
}

if(!user.isVerified){
return res.status(403).json({
message: "Bitte bestätige zuerst deine Email."
});
}

/* Passwort prüfen */

const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch){
return res.status(400).json({
message: "Falsches Passwort"
});
}

/* Tokens */

const accessToken = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);

/* Refresh Token speichern */

user.refreshToken = refreshToken;
await user.save();

/* Response */

res.json({
accessToken,
refreshToken
});

} catch (err) {

console.error("Login Fehler:", err);

res.status(500).json({
message: "Serverfehler"
});

}

});


/* =====================================================
REFRESH TOKEN
===================================================== */

router.post("/refresh", async (req, res) => {

const { refreshToken } = req.body;

if(!refreshToken){
return res.status(401).json({
message: "Refresh Token fehlt"
});
}

try {

/* Token prüfen */

const decoded = jwt.verify(
refreshToken,
process.env.JWT_REFRESH_SECRET
);

/* User laden */

const user = await User.findById(decoded.userId);

if(!user || user.refreshToken !== refreshToken){
return res.status(403).json({
message: "Ungültiger Refresh Token"
});
}

/* neuen Access Token erstellen */

const newAccessToken = generateAccessToken(user);

res.json({
accessToken: newAccessToken
});

} catch (err) {

console.error("Refresh Fehler:", err);

res.status(403).json({
message: "Ungültiger Token"
});

}

});


/* =====================================================
LOGOUT
===================================================== */

router.post("/logout", async (req, res) => {

const { refreshToken } = req.body;

if(!refreshToken){
return res.sendStatus(204);
}

try{

const decoded = jwt.verify(
refreshToken,
process.env.JWT_REFRESH_SECRET
);

const user = await User.findById(decoded.userId);

if(user){
user.refreshToken = null;
await user.save();
}

res.sendStatus(204);

}catch{

res.sendStatus(204);

}

});


module.exports = router;