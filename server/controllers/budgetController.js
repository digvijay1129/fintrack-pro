const Budget = require("../models/Budget");

const createBudget = async (req, res) => {
  try {
    const budget = await Budget.create(
      req.body
    );

    res.status(201).json(budget);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      user: req.params.userId,
    });

    res.status(200).json(budget);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBudget,
  getBudget,
};