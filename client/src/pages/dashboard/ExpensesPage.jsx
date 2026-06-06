import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";

import {
  getExpenses,
} from "../../services/expenseService";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function ExpensesPage() {
  const [expenses, setExpenses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [filterCategory,
    setFilterCategory] =
    useState("");

  const [sortBy, setSortBy] =
    useState("latest");

  useEffect(() => {
    const fetchExpenses =
      async () => {
        try {
          const data =
            await getExpenses();

          setExpenses(data);

        } catch (error) {
          console.log(error);
        }
      };

    fetchExpenses();
  }, []);

  const categories = [
    ...new Set(
      expenses.map(
        expense => expense.category
      )
    ),
  ];

  const filteredExpenses =
    expenses
      .filter(
        expense =>
          expense.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
          &&
          (
            filterCategory === ""
            ||
            expense.category ===
            filterCategory
          )
      )
      .sort((a, b) => {

        if (
          sortBy === "high"
        ) {
          return (
            b.amount -
            a.amount
          );
        }

        if (
          sortBy === "low"
        ) {
          return (
            a.amount -
            b.amount
          );
        }

        if (
          sortBy === "az"
        ) {
          return a.title.localeCompare(
            b.title
          );
        }

        if (
          sortBy === "za"
        ) {
          return b.title.localeCompare(
            a.title
          );
        }

        return (
          new Date(
            b.createdAt
          ) -
          new Date(
            a.createdAt
          )
        );

      });

  const totalExpenses =
    filteredExpenses.length;

  const totalSpending =
    filteredExpenses.reduce(
      (total, expense) =>
        total + expense.amount,
      0
    );

  const totalCategories =
    new Set(
      filteredExpenses.map(
        expense =>
          expense.category
      )
    ).size;

  const highestExpense =
    filteredExpenses.length > 0
      ? Math.max(
        ...filteredExpenses.map(
          expense =>
            expense.amount
        )
      )
      : 0;

  const chartData =
    categories.map(
      (category) => ({

        category,

        amount:
          expenses
            .filter(
              expense =>
                expense.category ===
                category
            )
            .reduce(
              (
                total,
                expense
              ) =>
                total +
                expense.amount,
              0
            ),

      })
    );

  return (
    <DashboardLayout>

      <div className="p-8">

        <h1 className="text-4xl font-bold mb-2">
          Expenses
        </h1>

        <p className="text-slate-500 mb-8">
          Manage all your expenses
        </p>

        <div className="grid md:grid-cols-4 gap-4 mb-8">

          <div className="
    bg-white
    p-5
    rounded-2xl
    shadow
  ">
            <p className="text-slate-500">
              Expenses
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalExpenses}
            </h2>
          </div>

          <div className="
    bg-white
    p-5
    rounded-2xl
    shadow
  ">
            <p className="text-slate-500">
              Spending
            </p>

            <h2 className="text-3xl font-bold mt-2 text-emerald-600">
              ₹ {totalSpending}
            </h2>
          </div>

          <div className="
    bg-white
    p-5
    rounded-2xl
    shadow
  ">
            <p className="text-slate-500">
              Categories
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalCategories}
            </h2>
          </div>

          <div className="
    bg-white
    p-5
    rounded-2xl
    shadow
  ">
            <p className="text-slate-500">
              Highest
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-500">
              ₹ {highestExpense}
            </h2>
          </div>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">

          <input
            type="text"
            placeholder="🔍 Search expenses..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
      p-3
      border
      rounded-xl
    "
          />

          <select
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(
                e.target.value
              )
            }
            className="
      p-3
      border
      rounded-xl
    "
          >
            <option value="">
              All Categories
            </option>

            {categories.map(category => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}

          </select>

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="
      p-3
      border
      rounded-xl
    "
          >
            <option value="latest">
              Latest
            </option>

            <option value="high">
              Highest Amount
            </option>

            <option value="low">
              Lowest Amount
            </option>

            <option value="az">
              A-Z
            </option>

            <option value="za">
              Z-A
            </option>

          </select>

        </div>

        <div
          className="
    bg-white
    rounded-3xl
    shadow-lg
    p-6
    mb-8
  "
        >

          <h2
            className="
      text-2xl
      font-bold
      mb-6
    "
          >
            Expense Analytics
          </h2>

          <div
            style={{
              width: "100%",
              height: 300,
            }}
          >

            <ResponsiveContainer>

              <BarChart
                data={chartData}
              >

                <XAxis
                  dataKey="category"
                />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="amount"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* Expense List */}

        <div className="space-y-4">

          {filteredExpenses.length === 0 ? (

            <div
              className="
                bg-white
                p-6
                rounded-2xl
                shadow
                text-center
              "
            >
              <div
                className="
    bg-white
    rounded-3xl
    shadow
    p-12
    text-center
  "
              >

                <div className="text-6xl mb-4">
                  💳
                </div>

                <h2 className="text-2xl font-bold">
                  No Expenses Found
                </h2>

                <p className="text-slate-500 mt-2">
                  Add your first expense to
                  get started.
                </p>

              </div>
            </div>

          ) : (

            filteredExpenses.map(
              (expense) => (

                <div
                  key={expense._id}
                  className="
    bg-white
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
  "
                >

                  <div>

                    <h3
                      className="
        text-xl
        font-bold
      "
                    >
                      {expense.title}
                    </h3>

                    <p
                      className="
        text-slate-500
      "
                    >
                      <span
                        className="
          inline-block
          px-3
          py-1
          rounded-full
          bg-blue-100
          text-blue-700
          text-sm
          font-medium
        "
                      >
                        {expense.category}
                      </span>
                    </p>

                  </div>

                  <div
                    className="
      text-2xl
      font-bold
      text-emerald-600
    "
                  >

                    <div>

                      <p
                        className="
          text-2xl
          font-bold
          text-emerald-600
        "
                      >
                        ₹ {expense.amount}
                      </p>

                      <p
                        className="
          text-sm
          text-slate-400
        "
                      >
                        Expense
                      </p>

                    </div>

                  </div>

                </div>

              )
            )

          )}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ExpensesPage;