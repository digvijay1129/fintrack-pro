const express = require("express");

const {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications
router.get(
  "/",
  protect,
  getNotifications
);

// Create notification
router.post(
  "/",
  protect,
  createNotification
);

// Mark all notifications as read
// Placed above /:id to prevent route parameter collision
router.put(
  "/mark-all-read",
  protect,
  markAllAsRead
);

// Clear all notifications
// Placed above /:id to prevent route parameter collision
router.delete(
  "/clear-all",
  protect,
  clearAllNotifications
);

// Delete notification
router.delete(
  "/:id",
  protect,
  deleteNotification
);

// Mark notification as read
router.put(
  "/:id",
  protect,
  markAsRead
);

module.exports = router;