const RecurringExpense = require(
  "../models/RecurringExpense"
);

// Create
const createRecurringExpense =
async (req, res) => {

  try {

    const recurringExpense =
    await RecurringExpense.create({

      ...req.body,

      user: req.user._id,

    });

    res.status(201).json(
      recurringExpense
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// Get All
const getRecurringExpenses =
async (req, res) => {

  try {

    const recurringExpenses =
    await RecurringExpense.find({

      user: req.user._id,

    });

    res.status(200).json(
      recurringExpenses
    );

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

// Delete
const deleteRecurringExpense =
async (req, res) => {

  try {

    const recurringExpense =
    await RecurringExpense.findOneAndDelete({

      _id: req.params.id,

      user: req.user._id,

    });

    if (!recurringExpense) {

      return res.status(404).json({

        message:
        "Recurring expense not found",

      });

    }

    res.status(200).json({

      message:
      "Recurring expense deleted",

    });

  } catch (error) {

    res.status(500).json({

      message:
      error.message,

    });

  }

};

module.exports = {

createRecurringExpense,

getRecurringExpenses,

deleteRecurringExpense,

};