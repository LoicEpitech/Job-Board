const express = require("express");
const router = express.Router();
const jobController = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Routes pour les offres d'emploi
router.get("/", jobController.getAllJobs);
router.get("/my-jobs", authMiddleware, jobController.getMyJobs);
router.get("/:id", jobController.getJobById);
router.post(
  "/postJob",
  authMiddleware,
  authorize("recruteur", "admin"),
  jobController.postJob
);

router.put(
  "/edit/:id",
  authMiddleware,
  authorize("recruteur", "admin"),
  jobController.editJob
);
router.delete("/delete/:id", authMiddleware, jobController.deleteJob);

module.exports = router;
