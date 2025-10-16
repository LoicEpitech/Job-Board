const express = require("express");
const router = express.Router();
const companiesController = require("../controllers/companiesController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

router.get(
  "/",
  authMiddleware,
  authorize("admin"),
  companiesController.getAllCompanies
);
router.get("/:id", authMiddleware, companiesController.getCompanyById);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorize("admin"),
  companiesController.deleteCompany
);
router.get(
  "/searchCompanies",
  authMiddleware,
  companiesController.searchCompanies
);
router.post(
  "/create",
  authMiddleware,
  authorize("admin"),
  companiesController.createCompany
);
router.put(
  "/edit/:id",
  authMiddleware,
  authorize("admin"),
  companiesController.updateCompany
);

module.exports = router;
