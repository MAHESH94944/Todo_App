const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const validationMiddleware = require("../middleware/validationMiddleware");

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

module.exports = router;
