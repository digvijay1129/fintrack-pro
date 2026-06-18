const express = require("express");

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  updateCurrency,
} = require("../controllers/authController");

const {
  protect,
} = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/reset-password",
  resetPassword
);

router.put(
  "/currency",
  protect,
  updateCurrency
);

module.exports = router;