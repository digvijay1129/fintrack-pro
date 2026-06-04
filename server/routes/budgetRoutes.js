const express = require("express");

const {
  createBudget,
  getBudget,
} = require(
  "../controllers/budgetController"
);

const router = express.Router();

router.post("/", createBudget);

router.get("/:userId", getBudget);

module.exports = router;