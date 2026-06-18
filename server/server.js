require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const recurringExpenseRoutes = require(
  "./routes/recurringExpenseRoutes"
);
const recurringExpenseJob =
require("./jobs/recurringExpenseJob");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("FinTrack Pro Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);
app.use(
  "/api/recurring-expenses",
  recurringExpenseRoutes
);

const PORT = process.env.PORT || 5000;

recurringExpenseJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
