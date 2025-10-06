const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validationMiddleware = require("../middleware/validationMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

router.post(
  "/register",
  validationMiddleware.registerUserValidation,
  authController.register
);
router.post(
  "/login",
  validationMiddleware.loginUserValidation,
  authController.login
);
router.post("/logout", authController.logout);

// get current user
router.get("/me", authController.me);

module.exports = router;
