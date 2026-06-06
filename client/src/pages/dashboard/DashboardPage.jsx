import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
} from "../../services/expenseService";

import {
  createBudget,
  getBudget,
} from "../../services/budgetService";

import { FaEdit, FaTrash } from "react-icons/fa";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#7c3aed",
  "#0891b2",
];

function DashboardPage() {
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [budget, setBudget] = useState(null);

  const [budgetAmount, setBudgetAmount] = useState("");

  const totalAmount = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const remainingBudget = budget ? budget.amount - totalAmount : 0;

  const budgetPercentage =
    budget && budget.amount > 0
      ? Math.min((totalAmount / budget.amount) * 100, 100)
      : 0;

  const averageExpense =
    expenses.length > 0
      ? (totalAmount / expenses.length).toFixed(2)
      : 0;

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => expense.amount))
      : 0;

  const lowestExpense =
    expenses.length > 0
      ? Math.min(...expenses.map((expense) => expense.amount))
      : 0;

  const monthlySpending = totalAmount;

  const dailyAverage = (totalAmount / 30).toFixed(2);

  const budgetStatus =
    budgetPercentage >= 100
      ? "Budget Exceeded"
      : budgetPercentage >= 80
      ? "Near Budget Limit"
      : "Budget Healthy";

  const categories = [
    ...new Set(expenses.map((expense) => expense.category)),
  ];

  const categoryData = categories.map((category) => ({
    name: category,
    value: expenses
      .filter((expense) => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0),
  }));

  const highestCategory =
    categories.length > 0
      ? categories.reduce((best, current) => {
          const bestTotal = expenses
            .filter((expense) => expense.category === best)
            .reduce((sum, expense) => sum + expense.amount, 0);

          const currentTotal = expenses
            .filter((expense) => expense.category === current)
            .reduce((sum, expense) => sum + expense.amount, 0);

          return currentTotal > bestTotal ? current : best;
        })
      : "N/A";

  const averageTransaction =
    expenses.length > 0
      ? (totalAmount / expenses.length).toFixed(2)
      : 0;

  const recommendation =
    budgetPercentage >= 80 ? "Reduce Spending" : "Keep Saving";

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);

      const data = await getExpenses();

      setExpenses(data);

      alert("Expense Deleted");
    } catch (error) {
      console.log(error);

      alert("Delete Failed");
    }
  };

  const handleCreateBudget = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const data = await createBudget({
        user: user.id,
        amount: Number(budgetAmount),
      });

      setBudget(data);
      setBudgetAmount("");

      alert("Budget Created");
    } catch (error) {
      console.log(error);
      alert("Failed to Create Budget");
    }
  };

  const handleAddExpense = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (editingId) {
        await updateExpense(editingId, {
          title,
          amount: Number(amount),
          category,
        });

        alert("Expense Updated");
        setEditingId(null);
      } else {
        await createExpense({
          user: user.id,
          title,
          amount: Number(amount),
          category,
        });

        alert("Expense Added");
      }

      const data = await getExpenses();
      setExpenses(data);

      setTitle("");
      setAmount("");
      setCategory("");
    } catch (error) {
      console.log(error);
      alert("Operation Failed");
    }
  };

  const handleEditExpense = (expense) => {
    setEditingId(expense._id);
    setTitle(expense.title);
    setAmount(expense.amount);
    setCategory(expense.category);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const today = new Date();

    // Replace slashes with hyphens to ensure it's a valid filename on all OS
    const rawDate = today.toLocaleDateString();
    const reportDate = rawDate.replace(/\//g, "-"); 
    const reportTime = today.toLocaleTimeString();

    doc.setFontSize(22);
    doc.text("FinTrack Pro", 20, 20);

    doc.setFontSize(16);
    doc.text("Financial Report", 20, 32);

    doc.setFontSize(11);
    doc.text(`Date: ${rawDate}`, 20, 45);
    doc.text(`Time: ${reportTime}`, 120, 45);

    doc.text(`Total Expenses: ${expenses.length}`, 20, 60);
    doc.text(`Total Spending: ₹ ${totalAmount}`, 20, 70);
    doc.text(`Budget: ₹ ${budget?.amount || 0}`, 20, 80);
    doc.text(`Remaining: ₹ ${remainingBudget}`, 20, 90);

    // Step 1: Analytics Summary
    doc.text(`Average Expense: ₹ ${averageExpense}`, 20, 100);
    doc.text(`Highest Expense: ₹ ${highestExpense}`, 20, 110);
    doc.text(`Lowest Expense: ₹ ${lowestExpense}`, 20, 120);

    // Step 3: Budget Status
    doc.text(`Budget Status: ${budgetStatus}`, 20, 130);

    autoTable(doc, {
      startY: 135, // Step 2: Move Expense Table
      head: [["Expense", "Category", "Amount"]],
      body: expenses.map((expense) => [
        expense.title,
        expense.category,
        `₹ ${expense.amount}`,
      ]),
    });

    // Step 5: Footer
    doc.setFontSize(10);
    doc.text("Generated by FinTrack Pro", 20, doc.lastAutoTable.finalY + 20);
    doc.text("Smart Expense & Budget Management Platform", 20, doc.lastAutoTable.finalY + 28);

    // Step 4: Better PDF Name
    doc.save(`FinTrack_Report_${reportDate}.pdf`);
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);

        const user = JSON.parse(localStorage.getItem("user"));

        const budgetData = await getBudget(user.id);
        setBudget(budgetData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenses();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div
            className="
              lg:col-span-2
              bg-gradient-to-r
              from-indigo-600
              via-blue-600
              to-purple-600
              rounded-3xl
              p-8
              text-white
              shadow-xl
            "
          >
            <h1 className="text-4xl font-bold mb-3">Welcome Back 👋</h1>

            <p className="text-lg text-indigo-100">
              Track expenses, monitor spending and achieve your financial
              goals.
            </p>

            <button
              onClick={exportPDF}
              className="
                mt-6
                bg-white
                text-indigo-700
                px-6
                py-3
                rounded-xl
                font-semibold
                hover:scale-105
                transition-all
              "
            >
              📄 Export PDF
            </button>
          </div>

          <div
            className="
              bg-white
              rounded-3xl
              p-6
              shadow-lg
            "
          >
            <p className="text-slate-500">Total Spending</p>

            <h2 className="text-4xl font-bold mt-3 text-emerald-600">
              ₹ {totalAmount}
            </h2>

            <p className="mt-2 text-slate-400">This Month</p>
          </div>
        </div>

        {/* Main Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2">
            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div
                className="
                  bg-white
                  rounded-2xl
                  p-5
                  shadow-md
                "
              >
                <p className="text-slate-500">Expenses</p>

                <h2 className="text-3xl font-bold mt-2">
                  {expenses.length}
                </h2>
              </div>

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-5
                  shadow-md
                "
              >
                <p className="text-slate-500">Categories</p>

                <h2 className="text-3xl font-bold mt-2">
                  {categories.length}
                </h2>
              </div>

              <div
                className="
                  bg-white
                  rounded-2xl
                  p-5
                  shadow-md
                "
              >
                <p className="text-slate-500">Budget Used</p>

                <h2 className="text-3xl font-bold mt-2">
                  {budgetPercentage.toFixed(0)}%
                </h2>

                <p className="text-sm text-slate-500 mt-2">
                  {budgetStatus}
                </p>
              </div>
            </div>

            {/* Additional Analytics Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div
                className="
                  bg-white
                  p-5
                  rounded-2xl
                  shadow-md
                "
              >
                <p className="text-slate-500">Average Expense</p>
                <h2 className="text-3xl font-bold mt-2">
                  ₹ {averageExpense}
                </h2>
              </div>

              <div
                className="
                  bg-white
                  p-5
                  rounded-2xl
                  shadow-md
                "
              >
                <p className="text-slate-500">Highest Expense</p>
                <h2 className="text-3xl font-bold mt-2 text-red-500">
                  ₹ {highestExpense}
                </h2>
              </div>

              <div
                className="
                  bg-white
                  p-5
                  rounded-2xl
                  shadow-md
                "
              >
                <p className="text-slate-500">Lowest Expense</p>
                <h2 className="text-3xl font-bold mt-2 text-emerald-600">
                  ₹ {lowestExpense}
                </h2>
              </div>
            </div>

            {/* Monthly Analytics */}
            <div
              className="
                bg-white
                rounded-3xl
                shadow-lg
                p-6
                mb-6
              "
            >
              <h2
                className="
                  text-2xl
                  font-bold
                  mb-6
                "
              >
                Monthly Analytics
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-500">Monthly Spending</p>

                  <h3 className="text-3xl font-bold mt-2">
                    ₹ {monthlySpending}
                  </h3>
                </div>

                <div>
                  <p className="text-slate-500">Daily Average</p>

                  <h3 className="text-3xl font-bold mt-2">
                    ₹ {dailyAverage}
                  </h3>
                </div>

                <div>
                  <p className="text-slate-500">Budget Status</p>

                  <h3
                    className="
                      text-xl
                      font-bold
                      mt-2
                      text-blue-600
                    "
                  >
                    {budgetStatus}
                  </h3>
                </div>
              </div>
            </div>

            {/* Financial Insights */}
            <div
              className="
                bg-white
                rounded-3xl
                shadow-lg
                p-6
                mb-6
              "
            >
              <h2 className="text-2xl font-bold mb-6">
                Financial Insights
              </h2>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-slate-500">Top Category</p>

                  <h3 className="text-2xl font-bold mt-2">
                    {highestCategory}
                  </h3>
                </div>

                <div>
                  <p className="text-slate-500">Avg Transaction</p>

                  <h3 className="text-2xl font-bold mt-2">
                    ₹ {averageTransaction}
                  </h3>
                </div>

                <div>
                  <p className="text-slate-500">Recommendation</p>

                  <h3
                    className="
                      text-xl
                      font-bold
                      mt-2
                      text-indigo-600
                    "
                  >
                    {recommendation}
                  </h3>
                </div>
              </div>
            </div>

            {/* Analytics Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold">
                Expense Analytics
              </h2>
              <p className="text-slate-500 mt-2">
                Category-wise spending insights
              </p>
            </div>

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              {/* Category Analytics Pie Chart */}
              <div
                className="
                  bg-white
                  rounded-3xl
                  shadow-lg
                  p-6
                "
              >
                <h2
                  className="
                    text-2xl
                    font-bold
                    mb-6
                  "
                >
                  Category Analytics
                </h2>

                <div
                  style={{
                    width: "100%",
                    height: 300,
                  }}
                >
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>

                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Spending Comparison Bar Chart */}
              <div
                className="
                  bg-white
                  rounded-3xl
                  shadow-lg
                  p-6
                "
              >
                <h2
                  className="
                    text-2xl
                    font-bold
                    mb-6
                  "
                >
                  Spending Comparison
                </h2>

                <div
                  style={{
                    width: "100%",
                    height: 300,
                  }}
                >
                  <ResponsiveContainer>
                    <BarChart data={categoryData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill="#2563eb"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Analytics Summary Card */}
            <div
              className="
                bg-gradient-to-r
                from-indigo-600
                to-blue-600
                rounded-3xl
                p-6
                text-white
                mb-6
              "
            >
              <h2 className="text-2xl font-bold">
                Analytics Summary
              </h2>

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div>
                  <p className="opacity-80">
                    Categories
                  </p>
                  <h3 className="text-3xl font-bold">
                    {categories.length}
                  </h3>
                </div>

                <div>
                  <p className="opacity-80">
                    Expenses
                  </p>
                  <h3 className="text-3xl font-bold">
                    {expenses.length}
                  </h3>
                </div>

                <div>
                  <p className="opacity-80">
                    Budget Used
                  </p>
                  <h3 className="text-3xl font-bold">
                    {budgetPercentage.toFixed(0)}%
                  </h3>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div
              className="
                bg-white
                rounded-3xl
                shadow-lg
                border
                border-slate-200
                overflow-hidden
              "
            >
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-2xl font-bold">
                  Recent Transactions
                </h2>

                <p className="text-slate-500 mt-1">
                  Latest expense activity
                </p>
              </div>

              {expenses.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  No expenses found
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left p-4 font-semibold">
                        Expense
                      </th>

                      <th className="text-left p-4 font-semibold">
                        Category
                      </th>

                      <th className="text-left p-4 font-semibold">
                        Status
                      </th>

                      <th className="text-right p-4 font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {expenses.map((expense) => (
                      <tr
                        key={expense._id}
                        className="
                          border-t
                          border-slate-100
                          hover:bg-slate-50
                          transition-all
                        "
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                h-10
                                w-10
                                rounded-xl
                                bg-blue-100
                                flex
                                items-center
                                justify-center
                              "
                            >
                              💳
                            </div>

                            <div>
                              <h4 className="font-semibold">
                                {expense.title}
                              </h4>

                              <p className="text-sm text-slate-500">
                                Expense Record
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span
                            className="
                              px-3
                              py-1
                              rounded-full
                              bg-slate-100
                              text-slate-700
                              text-sm
                            "
                          >
                            {expense.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-green-600 font-medium">
                            Completed
                          </span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="font-bold text-lg text-emerald-600">
                            ₹ {expense.amount}
                          </div>

                          <button
                            onClick={() => handleEditExpense(expense)}
                            className="
                              mt-2
                              mr-2
                              p-2
                              bg-blue-500
                              text-white
                              rounded-lg
                              hover:bg-blue-600
                            "
                          >
                            <FaEdit />
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteExpense(expense._id)
                            }
                            className="
                              mt-2
                              p-2
                              bg-red-500
                              text-white
                              rounded-lg
                              hover:bg-red-600
                            "
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div
              className="
                mb-6
                bg-gradient-to-r
                from-emerald-500
                to-green-600
                text-white
                rounded-3xl
                p-6
              "
            >
              <h3 className="text-xl font-bold mb-4">
                Budget Summary
              </h3>

              <p>Budget: ₹ {budget?.amount || 0}</p>

              <p className="mt-2">Spent: ₹ {totalAmount}</p>

              <p className="mt-2">Remaining: ₹ {remainingBudget}</p>

              <div
                className="
                  mt-4
                  h-3
                  bg-white/30
                  rounded-full
                  overflow-hidden
                "
              >
                <div
                  className="h-full bg-white"
                  style={{
                    width: `${budgetPercentage}%`,
                  }}
                />
              </div>

              <p className="mt-2 text-sm">
                {budgetPercentage.toFixed(0)}% Used
              </p>
            </div>

            <div
              className="
                bg-white
                rounded-3xl
                shadow-lg
                p-6
                sticky
                top-6
              "
            >
              <h2 className="text-2xl font-bold mb-2">
                {editingId ? "Update Expense" : "Add Expense"}
              </h2>

              <p className="text-slate-500 mb-6">
                Record a new transaction
              </p>

              <input
                type="number"
                placeholder="Set Monthly Budget"
                value={budgetAmount}
                onChange={(e) => setBudgetAmount(e.target.value)}
                className="
                  w-full
                  p-3
                  border
                  rounded-xl
                  mb-3
                "
              />

              <button
                onClick={handleCreateBudget}
                className="
                  w-full
                  py-3
                  mb-4
                  rounded-xl
                  bg-emerald-600
                  text-white
                  font-semibold
                "
              >
                Save Budget
              </button>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Expense Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="
                    w-full
                    p-3
                    border
                    rounded-xl
                  "
                />

                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="
                    w-full
                    p-3
                    border
                    rounded-xl
                  "
                />

                <input
                  type="text"
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="
                    w-full
                    p-3
                    border
                    rounded-xl
                  "
                />

                <button
                  onClick={handleAddExpense}
                  className="
                    w-full
                    py-3
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-indigo-600
                    text-white
                    font-semibold
                  "
                >
                  {editingId ? "Update Expense" : "Add Expense"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;