const express = require("express");

const {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} = require("../controllers/expenseController");

const {
  protect,
} = require("../middleware/authMiddleware");

const upload =
require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("receipt"),
  createExpense
);

router.get(
  "/",
  protect,
  getExpenses
);

router.delete(
  "/:id",
  protect,
  deleteExpense
);

router.put(
  "/:id",
  protect,
  updateExpense
);

module.exports = router;