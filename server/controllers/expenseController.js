const Expense = require("../models/Expense");

const uploadToCloudinary =
  require(
    "../utils/uploadToCloudinary"
  );

const createExpense = async (req, res) => {
  try {
    let receipt = "";

    if (req.file) {
      const result =
        await uploadToCloudinary(
          req.file.buffer
        );

      receipt =
        result.secure_url;
    }

    const expense =
      await Expense.create({
        ...req.body,

        receipt,

        user: req.user._id,
      });

    res.status(201).json(expense);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses =
      await Expense.find({
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
    const expense =
      await Expense.findOneAndDelete({
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
    const expense =
      await Expense.findOneAndUpdate(
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