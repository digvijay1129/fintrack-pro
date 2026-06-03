require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

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
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


