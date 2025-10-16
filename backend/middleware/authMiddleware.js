const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token manquant" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ message: "Utilisateur introuvable" });

    req.user = user;

    // mettre le temps du token à 7 jours
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    req.user.tokenExpiration = expirationDate;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = authenticate;
