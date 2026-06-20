const Notification =
    require("../models/Notification");

// Get Notifications
const getNotifications =
    async (req, res) => {

        try {

            const notifications =
                await Notification.find({
                    user: req.user._id,
                })
                    .sort({
                        createdAt: -1,
                    });

            res.status(200).json(
                notifications
            );

        }

        catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });

        }

    };

// Create Notification
const createNotification =
    async (
        req,
        res
    ) => {

        try {

            const {
                title,
                message,
                type,
            } = req.body;

            const notification =
                await Notification.create({

                    user:
                        req.user._id,

                    title,

                    message,

                    type,

                });

            res.status(201).json(
                notification
            );

        }

        catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });

        }

    };

// Mark Read
const markAsRead =
    async (
        req,
        res
    ) => {

        try {

            const notification =
                await Notification.findOneAndUpdate(

                    {
                        _id:
                            req.params.id,

                        user:
                            req.user._id,
                    },

                    {
                        isRead:
                            true,
                    },

                    {
                        new:
                            true,
                    }

                );

            res.status(200).json(
                notification
            );

        }

        catch (error) {

            res.status(500).json({
                message:
                    error.message,
            });

        }

    };

module.exports = {

    getNotifications,

    createNotification,

    markAsRead,

};