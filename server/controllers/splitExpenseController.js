const SplitExpense = require("../models/SplitExpense");
const Team = require("../models/Team");

// Create Split Expense
const createSplitExpense = async (req, res) => {
  try {
    const {
      teamId,
      title,
      description,
      amount,
      splitType,
      participants,
    } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    // 1. Check Participants Exist (Minimum 2)
    if (!participants || participants.length < 2) {
      return res.status(400).json({
        message: "A shared expense must have at least 2 participants.",
      });
    }

    // 2. Prevent Duplicate Members
    const participantIds = participants.map((p) => p.user.toString());
    const uniqueIds = [...new Set(participantIds)];

    if (participantIds.length !== uniqueIds.length) {
      return res.status(400).json({
        message: "Duplicate participants are not allowed.",
      });
    }

    // 3. Verify Team Members
    const invalidParticipant = participants.find(
      (participant) =>
        !team.members.some(
          (member) => member.toString() === participant.user.toString()
        )
    );

    if (invalidParticipant) {
      return res.status(400).json({
        message: "All participants must be members of the team.",
      });
    }

    // Calculate split amounts if splitType is "equal"
    if (splitType === "equal") {
      const totalMembers = participants.length;
      const splitAmount = Math.floor((amount / totalMembers) * 100) / 100;
      let assignedAmount = 0;

      participants.forEach((participant, index) => {
        if (index === totalMembers - 1) {
          participant.amount = Number((amount - assignedAmount).toFixed(2));
        } else {
          participant.amount = splitAmount;
          assignedAmount += splitAmount;
        }

        participant.percentage = Number(
          ((participant.amount / amount) * 100).toFixed(2)
        );
      });
    }

    // Calculate amounts and validate if splitType is "percentage"
    if (splitType === "percentage") {
      const totalPercentage = participants.reduce(
        (sum, participant) => sum + participant.percentage,
        0
      );

      if (Number(totalPercentage.toFixed(2)) !== 100) {
        return res.status(400).json({
          message: "Total percentage must equal 100%.",
        });
      }

      let assignedAmount = 0;

      participants.forEach((participant, index) => {
        if (index === participants.length - 1) {
          participant.amount = Number((amount - assignedAmount).toFixed(2));
        } else {
          participant.amount = Number(
            ((amount * participant.percentage) / 100).toFixed(2)
          );
          assignedAmount += participant.amount;
        }
      });
    }

    // Validate amounts and calculate percentages if splitType is "custom"
    if (splitType === "custom") {
      const invalidAmount = participants.some(
        (participant) => participant.amount <= 0
      );

      if (invalidAmount) {
        return res.status(400).json({
          message: "Participant amounts must be greater than zero.",
        });
      }

      const totalAmount = participants.reduce(
        (sum, participant) => sum + participant.amount,
        0
      );

      if (Number(totalAmount.toFixed(2)) !== Number(amount.toFixed(2))) {
        return res.status(400).json({
          message: "Custom split amounts must equal the total expense amount.",
        });
      }

      participants.forEach((participant) => {
        participant.percentage = Number(
          ((participant.amount / amount) * 100).toFixed(2)
        );
      });
    }

    const expense = await SplitExpense.create({
      team: teamId,
      paidBy: req.user._id,
      title,
      description,
      amount,
      splitType,
      participants,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Team Split Expenses
const getTeamExpenses = async (req, res) => {
  try {
    const expenses = await SplitExpense.find({
      team: req.params.teamId,
    })
      .populate("paidBy", "name email")
      .populate("participants.user", "name email")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Split Expense
const deleteSplitExpense = async (req, res) => {
  try {
    const expense = await SplitExpense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    const team = await Team.findById(expense.team);

    const isExpenseCreator =
      expense.paidBy.toString() === req.user._id.toString();

    const isTeamOwner = team.owner.toString() === req.user._id.toString();

    if (!isExpenseCreator && !isTeamOwner) {
      return res.status(403).json({
        message:
          "Only the expense creator or team owner can delete this expense.",
      });
    }

    await expense.deleteOne();

    res.status(200).json({
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Split Expense
const updateSplitExpense = async (req, res) => {
  try {
    const {
      title,
      description,
      amount,
      splitType,
      participants,
    } = req.body;

    const expense = await SplitExpense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({
        message: "Expense not found",
      });
    }

    const team = await Team.findById(expense.team);

    const isExpenseCreator =
      expense.paidBy.toString() === req.user._id.toString();

    const isTeamOwner = team.owner.toString() === req.user._id.toString();

    if (!isExpenseCreator && !isTeamOwner) {
      return res.status(403).json({
        message:
          "Only the expense creator or team owner can update this expense.",
      });
    }

    // 1. Check Participants Exist (Minimum 2)
    if (!participants || participants.length < 2) {
      return res.status(400).json({
        message: "A shared expense must have at least 2 participants.",
      });
    }

    // 2. Prevent Duplicate Members
    const participantIds = participants.map((p) => p.user.toString());
    const uniqueIds = [...new Set(participantIds)];

    if (participantIds.length !== uniqueIds.length) {
      return res.status(400).json({
        message: "Duplicate participants are not allowed.",
      });
    }

    // 3. Verify Team Members
    const invalidParticipant = participants.find(
      (participant) =>
        !team.members.some(
          (member) => member.toString() === participant.user.toString()
        )
    );

    if (invalidParticipant) {
      return res.status(400).json({
        message: "All participants must be members of the team.",
      });
    }

    // Calculate split amounts if splitType is "equal"
    if (splitType === "equal") {
      const totalMembers = participants.length;
      const splitAmount = Math.floor((amount / totalMembers) * 100) / 100;
      let assignedAmount = 0;

      participants.forEach((participant, index) => {
        if (index === totalMembers - 1) {
          participant.amount = Number((amount - assignedAmount).toFixed(2));
        } else {
          participant.amount = splitAmount;
          assignedAmount += splitAmount;
        }

        participant.percentage = Number(
          ((participant.amount / amount) * 100).toFixed(2)
        );
      });
    }

    // Calculate amounts and validate if splitType is "percentage"
    if (splitType === "percentage") {
      const totalPercentage = participants.reduce(
        (sum, participant) => sum + participant.percentage,
        0
      );

      if (Number(totalPercentage.toFixed(2)) !== 100) {
        return res.status(400).json({
          message: "Total percentage must equal 100%.",
        });
      }

      let assignedAmount = 0;

      participants.forEach((participant, index) => {
        if (index === participants.length - 1) {
          participant.amount = Number((amount - assignedAmount).toFixed(2));
        } else {
          participant.amount = Number(
            ((amount * participant.percentage) / 100).toFixed(2)
          );
          assignedAmount += participant.amount;
        }
      });
    }

    // Validate amounts and calculate percentages if splitType is "custom"
    if (splitType === "custom") {
      const invalidAmount = participants.some(
        (participant) => participant.amount <= 0
      );

      if (invalidAmount) {
        return res.status(400).json({
          message: "Participant amounts must be greater than zero.",
        });
      }

      const totalAmount = participants.reduce(
        (sum, participant) => sum + participant.amount,
        0
      );

      if (Number(totalAmount.toFixed(2)) !== Number(amount.toFixed(2))) {
        return res.status(400).json({
          message: "Custom split amounts must equal the total expense amount.",
        });
      }

      participants.forEach((participant) => {
        participant.percentage = Number(
          ((participant.amount / amount) * 100).toFixed(2)
        );
      });
    }

    expense.title = title ?? expense.title;
    expense.description = description ?? expense.description;
    expense.amount = amount ?? expense.amount;
    expense.splitType = splitType ?? expense.splitType;
    expense.participants = participants ?? expense.participants;

    await expense.save();

    res.status(200).json(expense);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createSplitExpense,
  getTeamExpenses,
  deleteSplitExpense,
  updateSplitExpense,
};