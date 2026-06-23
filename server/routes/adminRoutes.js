const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getUserCount,
  deleteUser,
  getExpenseCount,
  getBudgetCount,
  getRecentUsers,
  getAdminNotifications,
} = require("../controllers/adminController");

router.get("/test", protect, adminOnly, (req, res) => {
  res.json({
    message: "Admin route working",
  });
});

router.get("/users", protect, adminOnly, getAllUsers);

router.get("/stats/users", protect, adminOnly, getUserCount);

router.delete("/users/:id", protect, adminOnly, deleteUser);

router.get("/stats/expenses", protect, adminOnly, getExpenseCount);

router.get("/stats/budgets", protect, adminOnly, getBudgetCount);

router.get("/recent-users", protect, adminOnly, getRecentUsers);

router.get("/notifications", protect, adminOnly, getAdminNotifications);

module.exports = router;