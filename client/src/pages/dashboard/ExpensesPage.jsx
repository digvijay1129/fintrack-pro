import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";

import { getExpenses } from "../../services/expenseService";
import { getCurrencySymbol } from "../../utils/currency";
import { convertCurrency } from "../../utils/currencyConverter";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ExpensesPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const currency = getCurrencySymbol(user?.currency);

  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDarkMode(theme === "dark");
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();
        setExpenses(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenses();
  }, []);

  const categories = [
    ...new Set(expenses.map((expense) => expense.category)),
  ];

  const filteredExpenses = expenses
    .filter(
      (expense) =>
        expense.title.toLowerCase().includes(search.toLowerCase()) &&
        (filterCategory === "" || expense.category === filterCategory)
    )
    .sort((a, b) => {
      if (sortBy === "high") {
        return b.amount - a.amount;
      }
      if (sortBy === "low") {
        return a.amount - b.amount;
      }
      if (sortBy === "az") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "za") {
        return b.title.localeCompare(a.title);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalExpenses = filteredExpenses.length;

  const totalSpending = filteredExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const totalCategories = new Set(
    filteredExpenses.map((expense) => expense.category)
  ).size;

  const highestExpense =
    filteredExpenses.length > 0
      ? Math.max(...filteredExpenses.map((expense) => expense.amount))
      : 0;

  const chartData = categories.map((category) => ({
    category,
    amount: expenses
      .filter((expense) => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0),
  }));

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className={`text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Expenses
        </h1>

        <p className={`mb-8 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
          Manage all your expenses
        </p>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div
            className={`
              p-5
              rounded-2xl
              shadow
              ${
                darkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-900"
              }
            `}
          >
            <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
              Expenses
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalExpenses}
            </h2>
          </div>

          <div
            className={`
              p-5
              rounded-2xl
              shadow
              ${
                darkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-900"
              }
            `}
          >
            <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
              Spending
            </p>

            <h2 className="text-3xl font-bold mt-2 text-emerald-600">
              {currency} {convertCurrency(totalSpending, user?.currency)}
            </h2>
          </div>

          <div
            className={`
              p-5
              rounded-2xl
              shadow
              ${
                darkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-900"
              }
            `}
          >
            <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
              Categories
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalCategories}
            </h2>
          </div>

          <div
            className={`
              p-5
              rounded-2xl
              shadow
              ${
                darkMode
                  ? "bg-slate-800 text-white"
                  : "bg-white text-slate-900"
              }
            `}
          >
            <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
              Highest
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-500">
              {currency} {convertCurrency(highestExpense, user?.currency)}
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`
              p-3
              border
              rounded-xl
              ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300"
              }
            `}
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`
              p-3
              border
              rounded-xl
              ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300"
              }
            `}
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`
              p-3
              border
              rounded-xl
              ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300"
              }
            `}
          >
            <option value="latest">Latest</option>
            <option value="high">Highest Amount</option>
            <option value="low">Lowest Amount</option>
            <option value="az">A-Z</option>
            <option value="za">Z-A</option>
          </select>
        </div>

        <div
          className={`
            rounded-3xl
            shadow-lg
            p-6
            mb-8
            ${
              darkMode
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-900"
            }
          `}
        >
          <h2 className="text-2xl font-bold mb-6">Expense Analytics</h2>

          <div
            style={{
              width: "100%",
              height: 300,
            }}
          >
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="category" 
                  stroke={darkMode ? "#cbd5e1" : "#64748b"} 
                />
                <YAxis stroke={darkMode ? "#cbd5e1" : "#64748b"} />
                <Tooltip 
                  formatter={(value) => `${currency} ${convertCurrency(value, user?.currency)}`}
                  contentStyle={darkMode ? { backgroundColor: "#1e293b", borderColor: "#334155", color: "#fff" } : {}}
                />
                <Bar
                  dataKey="amount"
                  fill="#2563eb"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense List */}
        <div className="space-y-4">
          {filteredExpenses.length === 0 ? (
            <div
              className={`
                p-6
                rounded-2xl
                shadow
                text-center
                ${
                  darkMode
                    ? "bg-slate-800 text-white"
                    : "bg-white"
                }
              `}
            >
              <div
                className={`
                  rounded-3xl
                  shadow
                  p-12
                  text-center
                  ${
                    darkMode
                      ? "bg-slate-800 text-white"
                      : "bg-white"
                  }
                `}
              >
                <div className="text-6xl mb-4">💳</div>

                <h2 className="text-2xl font-bold">
                  No Expenses Found
                </h2>

                <p className={`mt-2 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
                  Add your first expense to get started.
                </p>
              </div>
            </div>
          ) : (
            filteredExpenses.map((expense) => (
              <div
                key={expense._id}
                className={`
                  p-5
                  rounded-2xl
                  shadow
                  flex
                  justify-between
                  items-center
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                  ${
                    darkMode
                      ? "bg-slate-800 text-white"
                      : "bg-white text-slate-900"
                  }
                `}
              >
                <div>
                  <h3 className="text-xl font-bold">
                    {expense.title}
                  </h3>

                  <p className="mt-1">
                    <span
                      className={`
                        inline-block
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium
                        ${
                          darkMode
                            ? "bg-blue-900 text-blue-200"
                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {expense.category}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">
                    {currency} {convertCurrency(expense.amount, user?.currency)}
                  </p>

                  <p
                    className={`
                      text-sm
                      ${
                        darkMode
                          ? "text-slate-300"
                          : "text-slate-400"
                      }
                    `}
                  >
                    Expense
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ExpensesPage;