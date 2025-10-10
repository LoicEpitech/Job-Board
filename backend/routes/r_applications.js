const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

// Routes pour les candidatures
router.post(
  "/apply/:id",
  authMiddleware,
  authorize("candidat"),
  applicationController.applyToJob
);
router.get(
  "/my-applications",
  authMiddleware,
  authorize("candidat"),
  applicationController.getMyApplications
);

router.get(
  "/by-job/:id",
  authMiddleware,
  authorize("recruteur", "admin"),
  applicationController.getApplicationsForJob
);

router.put(
  "/:id/statut",
  authMiddleware,
  authorize("recruteur", "admin"),
  applicationController.updateApplicationStatus
);

// router.delete(
//   "/withdraw/:id",
//   authMiddleware,
//   authorize("candidat"),
//   applicationController.withdrawApplication
// );

module.exports = router;
