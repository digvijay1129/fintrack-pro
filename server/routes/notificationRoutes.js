const express = require("express");

const {
    getNotifications,
    createNotification,
    markAsRead,
} = require(
    "../controllers/notificationController"
);

const {
    protect,
} = require(
    "../middleware/authMiddleware"
);

const router =
    express.Router();

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

// Mark notification as read
router.put(
    "/:id",
    protect,
    markAsRead
);

module.exports =
    router;