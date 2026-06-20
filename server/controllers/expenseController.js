const Expense = require("../models/Expense");
const Notification = require("../models/Notification");
const Budget = require("../models/Budget");

const uploadToCloudinary = require("../utils/uploadToCloudinary");

const createExpense = async (req, res) => {
  try {
    let receipt = "";

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      receipt = result.secure_url;
    }

    const expense = await Expense.create({
      ...req.body,
      receipt,
      user: req.user._id,
    });

    const budget = await Budget.findOne({
      user: req.user._id,
    });

    if (budget) {
      const totalExpenses = await Expense.aggregate([
        {
          $match: {
            user: req.user._id,
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]);

      const spent = totalExpenses[0]?.total || 0;
      const percentage = (spent / budget.amount) * 100;

      const milestones = [
        {
          limit: 50,
          emoji: "🟢",
          title: "Budget Update",
        },
        {
          limit: 75,
          emoji: "🟡",
          title: "Budget Alert",
        },
        {
          limit: 90,
          emoji: "🟠",
          title: "Budget Warning",
        },
        {
          limit: 100,
          emoji: "🔴",
          title: "Budget Exceeded",
        },
      ];

      let currentMilestone = null;

      if (percentage >= 100) {
        currentMilestone = milestones[3];
      } else if (percentage >= 90) {
        currentMilestone = milestones[2];
      } else if (percentage >= 75) {
        currentMilestone = milestones[1];
      } else if (percentage >= 50) {
        currentMilestone = milestones[0];
      }

      if (currentMilestone) {
        const message = `${currentMilestone.emoji} You have used ${currentMilestone.limit}% of your budget. ₹${spent} spent out of ₹${budget.amount}.`;

        await Notification.updateMany(
          {
            user: req.user._id,
            type: "info",
            isRead: false,
          },
          {
            isRead: true,
          }
        );

        const exists = await Notification.findOne({
          user: req.user._id,
          message,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        });

        if (!exists) {
          await Notification.create({
            user: req.user._id,
            title: currentMilestone.title,
            message,
            type:
              currentMilestone.limit >= 100
                ? "danger"
                : currentMilestone.limit >= 90
                ? "warning"
                : "info",
            isRead: false,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
          });
        }
      }
    }

    res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user._id,
    });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
};