const express = require("express");

const {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

const router = express.Router();

router.post("/", createExpense);

router.get("/", getExpenses);

router.delete("/:id", deleteExpense);

router.put("/:id", updateExpense);

module.exports = router;