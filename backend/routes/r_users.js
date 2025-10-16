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
router.get("/", authMiddleware, userController.getUsers);
router.get("/me", authMiddleware, userController.getProfile);
router.put("/update", authMiddleware, userController.updateProfile);
router.put("/password", authMiddleware, userController.changePassword);
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

// Routes admin
router.post(
  "/create",
  authMiddleware,
  authorize("admin"),
  userController.createUser
);
router.put(
  "/edit/:id",
  authMiddleware,
  authorize("admin"),
  userController.updateUser
);
router.delete(
  "/delete/:id",
  authMiddleware,
  authorize("admin"),
  userController.deleteUser
);

module.exports = router;
