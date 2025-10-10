const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require("multer");
const authorize = require("../middleware/authorize");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/cv"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + require("path").extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes utilisateur
router.get("/me", authMiddleware, userController.getProfile);
router.get("/users", authMiddleware, userController.getUsers);
router.put("/update", authMiddleware, userController.updateProfile);
router.put("/password", authMiddleware, userController.changePassword);
router.get("/searchCompanies", authMiddleware, userController.searchCompanies);
// router.delete("/delete", authMiddleware, userController.deleteAccount);
router.post(
  "/upload-cv",
  authMiddleware,
  upload.single("cv"),
  authorize("candidat"),
  userController.uploadCV
);

router.put(
  "/update-type",
  authMiddleware,
  authorize("admin"),
  userController.updateUserType
);

module.exports = router;
