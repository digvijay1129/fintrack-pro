const cron = require("node-cron");
const RecurringExpense = require("../models/RecurringExpense");
const Expense = require("../models/Expense");
const Notification = require("../models/Notification");

const recurringExpenseJob = () => {
    cron.schedule("* * * * *", async () => {
        try {
            console.log("🚀 Checking recurring expenses...");

            const today = new Date();

            const recurringExpenses = await RecurringExpense.find({
                nextDueDate: {
                    $lte: today,
                },
            });

            for (const recurringExpense of recurringExpenses) {
                await Expense.create({
                    user: recurringExpense.user,
                    title: recurringExpense.title,
                    amount: recurringExpense.amount,
                    category: recurringExpense.category,
                });

                await Notification.findOneAndUpdate(
                    {
                        user: recurringExpense.user,
                        title: "Recurring Bill Processed",
                        message: `⚠ ${recurringExpense.title} recurring payment of ₹${recurringExpense.amount} was processed automatically.`,
                        month: new Date().getMonth() + 1,
                        year: new Date().getFullYear(),
                    },
                    {
                        user: recurringExpense.user,
                        title: "Recurring Bill Processed",
                        message: `⚠ ${recurringExpense.title} recurring payment of ₹${recurringExpense.amount} was processed automatically.`,
                        type: "info",
                        isRead: false,
                        month: new Date().getMonth() + 1,
                        year: new Date().getFullYear(),
                    },
                    {
                        upsert: true,
                        new: true,
                    }
                );

                console.log(
                    `✅ Expense created: ${recurringExpense.title}`
                );

                let nextDate = new Date(recurringExpense.nextDueDate);

                switch (recurringExpense.frequency) {
                    case "daily":
                        nextDate.setDate(nextDate.getDate() + 1);
                        break;
                    case "weekly":
                        nextDate.setDate(nextDate.getDate() + 7);
                        break;
                    case "monthly":
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        break;
                    case "yearly":
                        nextDate.setFullYear(nextDate.getFullYear() + 1);
                        break;
                }

                recurringExpense.nextDueDate = nextDate;
                await recurringExpense.save();
            }
        } catch (error) {
            console.log("Recurring Job Error:");
            console.log(error);
        }
    });
};

module.exports = recurringExpenseJob;