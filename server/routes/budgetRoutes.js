const express = require("express");
const {
  protect,
} = require("../middleware/authMiddleware");

const {
  createBudget,
  getBudget,
} = require(
  "../controllers/budgetController"
);

const router = express.Router();

router.post(
  "/",
  protect,
  createBudget
);

router.get(
  "/",
  protect,
  getBudget
);

module.exports = router;