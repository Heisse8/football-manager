const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = "SUPER_SECRET_KEY_CHANGE_THIS";

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Kein Token vorhanden" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User nicht gefunden" });
    }

    req.user = user;

    next();
  } catch (err) {
    res.status(401).json({ message: "Token ungültig" });
  }
}

module.exports = authMiddleware;