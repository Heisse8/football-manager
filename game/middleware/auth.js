const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

try{

/* =====================================================
AUTH HEADER
===================================================== */

const authHeader = req.headers.authorization;

if(!authHeader){
return res.status(401).json({
message:"Authorization Header fehlt"
});
}

/* =====================================================
FORMAT PRÜFEN
===================================================== */

const parts = authHeader.split(" ");

if(parts.length !== 2 || parts[0] !== "Bearer"){
return res.status(401).json({
message:"Ungültiges Token Format"
});
}

const token = parts[1];

/* =====================================================
TOKEN VERIFY
===================================================== */

const decoded = jwt.verify(
token,
process.env.JWT_SECRET
);

/* =====================================================
USER IN REQUEST
===================================================== */

req.user = {
userId: decoded.userId
};

next();

}catch(err){

/* =====================================================
TOKEN EXPIRED
===================================================== */

if(err.name === "TokenExpiredError"){
return res.status(401).json({
message:"Token abgelaufen"
});
}

/* =====================================================
INVALID TOKEN
===================================================== */

return res.status(401).json({
message:"Token ungültig"
});

}

};