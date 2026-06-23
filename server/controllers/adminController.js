const User = require("../models/User");
const Expense = require("../models/Expense");
const Budget = require("../models/Budget");
const Notification = require("../models/Notification");
const RecurringExpense = require("../models/RecurringExpense");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({
      totalUsers: count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin cannot be deleted",
      });
    }

    await Expense.deleteMany({
      user: req.params.id,
    });

    await Budget.deleteMany({
      user: req.params.id,
    });

    await Notification.deleteMany({
      user: req.params.id,
    });

    await RecurringExpense.deleteMany({
      user: req.params.id,
    });

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getExpenseCount = async (req, res) => {
  try {
    const count = await Expense.countDocuments();
    res.status(200).json({
      totalExpenses: count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBudgetCount = async (req, res) => {
  try {
    const count = await Budget.countDocuments();
    res.status(200).json({
      totalBudgets: count,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email role createdAt");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      type: "admin",
    })
      .sort({
        createdAt: -1,
      })
      .limit(10);

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getUserCount,
  deleteUser,
  getExpenseCount,
  getBudgetCount,
  getRecentUsers,
  getAdminNotifications,
};