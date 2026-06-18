const express = require("express");

const {
  createRecurringExpense,
  getRecurringExpenses,
  deleteRecurringExpense,
} = require(
  "../controllers/recurringExpenseController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

// Create
router.post(
  "/",
  protect,
  createRecurringExpense
);

// Get All
router.get(
  "/",
  protect,
  getRecurringExpenses
);

// Delete
router.delete(
  "/:id",
  protect,
  deleteRecurringExpense
);

module.exports = router;