const cron = require("node-cron");

const Notification =
    require("../models/Notification");

const notificationCleanupJob =
    () => {

        cron.schedule(
            "0 0 * * *",
            async () => {

                try {

                    const sevenDaysAgo =
                        new Date(
                            Date.now() -
                            7 *
                            24 *
                            60 *
                            60 *
                            1000
                        );

                    const result =
                        await Notification.deleteMany({
                            isRead: true,
                            readAt: {
                                $lte: sevenDaysAgo,
                            },
                        });

                    console.log(
                        `🧹 Deleted ${result.deletedCount} old notifications`
                    );

                } catch (error) {

                    console.log(
                        "Notification Cleanup Error"
                    );

                    console.log(error);

                }

            }
        );

    };

module.exports =
    notificationCleanupJob;