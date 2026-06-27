const express = require("express");

const router = express.Router();

const {
    protect,
} = require("../middleware/authMiddleware");

const {
  createSplitExpense,
  getTeamExpenses,
  deleteSplitExpense,
  updateSplitExpense,
} =
require("../controllers/splitExpenseController");

router.post(
    "/",
    protect,
    createSplitExpense
);

router.get(
    "/team/:teamId",
    protect,
    getTeamExpenses
);

router.delete(
    "/:id",
    protect,
    deleteSplitExpense
);

router.put(
  "/:id",
  protect,
  updateSplitExpense
);

module.exports = router;