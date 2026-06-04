import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";

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

import {
  FaEdit,
  FaTrash
} from "react-icons/fa";

function DashboardPage() {
  const [expenses, setExpenses] = useState([]);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [budget, setBudget] =
    useState(null);

  const [budgetAmount, setBudgetAmount] =
    useState("");

  const totalAmount = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const remainingBudget =
    budget
      ? budget.amount - totalAmount
      : 0;

  const budgetPercentage =
    budget && budget.amount > 0
      ? Math.min(
        (totalAmount /
          budget.amount) *
        100,
        100
      )
      : 0;



  const categories = [
    ...new Set(
      expenses.map(
        (expense) => expense.category
      )
    ),
  ];

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

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const data =
        await createBudget({
          user: user.id,
          amount: Number(
            budgetAmount
          ),
        });

      setBudget(data);

      setBudgetAmount("");

      alert("Budget Created");

    } catch (error) {

      console.log(error);

      alert(
        "Failed to Create Budget"
      );
    }
  };

  const handleAddExpense = async () => {
    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (editingId) {

        await updateExpense(
          editingId,
          {
            title,
            amount: Number(amount),
            category,
          }
        );

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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const data = await getExpenses();

        setExpenses(data);

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        const budgetData =
          await getBudget(user.id);

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
            <h1 className="text-4xl font-bold mb-3">
              Welcome Back 👋
            </h1>

            <p className="text-lg text-indigo-100">
              Track expenses, monitor spending and achieve
              your financial goals.
            </p>
          </div>

          <div
            className="
            bg-white
            rounded-3xl
            p-6
            shadow-lg
          "
          >
            <p className="text-slate-500">
              Total Spending
            </p>

            <h2 className="text-4xl font-bold mt-3 text-emerald-600">
              ₹ {totalAmount}
            </h2>

            <p className="mt-2 text-slate-400">
              This Month
            </p>
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
                <p className="text-slate-500">
                  Expenses
                </p>

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
                <p className="text-slate-500">
                  Categories
                </p>

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
                <p className="text-slate-500">
                  Budget Used
                </p>

                <h2 className="text-3xl font-bold mt-2">
                  {budgetPercentage.toFixed(0)}%
                </h2>
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
                            onClick={() =>
                              handleEditExpense(expense)
                            }
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

              <p>
                Budget:
                ₹ {budget?.amount || 0}
              </p>

              <p className="mt-2">
                Spent:
                ₹ {totalAmount}
              </p>

              <p className="mt-2">
                Remaining:
                ₹ {remainingBudget}
              </p>

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
                {budgetPercentage.toFixed(0)}%
                Used
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
                {editingId
                  ? "Update Expense"
                  : "Add Expense"}
              </h2>

              <p className="text-slate-500 mb-6">
                Record a new transaction
              </p>

              <input
                type="number"
                placeholder="Set Monthly Budget"
                value={budgetAmount}
                onChange={(e) =>
                  setBudgetAmount(
                    e.target.value
                  )
                }
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
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
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
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
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
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
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
                  {editingId
                    ? "Update Expense"
                    : "Add Expense"}
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