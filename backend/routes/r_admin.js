const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const authorize = require("../middleware/authorize");

// page admin réservée uniquement aux admins
router.get("/dashboard", authenticate, authorize("admin"), (req, res) => {
  res.json({ message: "Bienvenue admin !" });
});

module.exports = router;
