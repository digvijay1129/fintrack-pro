import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { getExpenses } from "../../services/expenseService";
import { getBudget, createBudget } from "../../services/budgetService";

function BudgetPage() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);
  
  // Step 1: Add State
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

  const budgetStatus =
    budgetPercentage >= 100
      ? "Budget Exceeded"
      : budgetPercentage >= 80
      ? "Near Budget Limit"
      : "Budget Healthy";

  // Step 1: Add Analytics Variables
  const averageExpense =
    expenses.length > 0
      ? (totalAmount / expenses.length).toFixed(2)
      : 0;

  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((expense) => expense.amount))
      : 0;

  const recommendation =
    budgetPercentage >= 80 ? "Reduce Spending" : "Keep Saving";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseData = await getExpenses();
        setExpenses(expenseData);

        const user = JSON.parse(localStorage.getItem("user"));
        const budgetData = await getBudget(user.id);
        setBudget(budgetData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  // Step 3: Create Budget Handler
  const handleBudgetUpdate = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const data = await createBudget({
        user: user.id,
        amount: Number(budgetAmount),
      });

      setBudget(data);
      setBudgetAmount("");

      alert("Budget Updated");
    } catch (error) {
      console.log(error);
      alert("Update Failed");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-2">Budget</h1>

        <p className="text-slate-500 mb-8">Manage your monthly budget</p>

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-8
          "
        >
          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >
            <div>
              <p className="text-slate-500">Current Budget</p>

              <h2 className="text-4xl font-bold mt-2">
                ₹ {budget?.amount || 0}
              </h2>
            </div>

            <div>
              <p className="text-slate-500">Total Spending</p>

              <h2 className="text-4xl font-bold mt-2 text-red-500">
                ₹ {totalAmount}
              </h2>
            </div>

            <div>
              <p className="text-slate-500">Remaining</p>

              <h2 className="text-4xl font-bold mt-2 text-green-600">
                ₹ {remainingBudget}
              </h2>
            </div>

            <div>
              <p className="text-slate-500">Budget Used</p>

              <h2 className="text-4xl font-bold mt-2">
                {budgetPercentage.toFixed(0)}%
              </h2>
            </div>
          </div>

          <div className="mt-8">
            <div
              className="
                h-4
                rounded-full
                bg-slate-200
                overflow-hidden
              "
            >
              <div
                className="
                  h-full
                  bg-emerald-500
                "
                style={{
                  width: `${budgetPercentage}%`,
                }}
              />
            </div>

            <p
              className="
                mt-4
                text-lg
                font-semibold
              "
            >
              {budgetStatus}
            </p>
          </div>

          {/* Step 4: Budget Update Card */}
          <div
            className="
              mt-10
              border-t
              pt-8
            "
          >
            <h2
              className="
                text-2xl
                font-bold
                mb-4
              "
            >
              Update Budget
            </h2>

            <input
              type="number"
              placeholder="Monthly Budget"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              className="
                w-full
                p-3
                border
                rounded-xl
                mb-4
              "
            />

            <button
              onClick={handleBudgetUpdate}
              className="
                bg-emerald-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
              "
            >
              Save Budget
            </button>
          </div>

          {/* Step 2: Add Budget Insights Card */}
          <div
            className="
              mt-10
              border-t
              pt-8
            "
          >
            <h2 className="text-2xl font-bold mb-6">
              Budget Insights
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-slate-500">
                  Average Expense
                </p>

                <h3 className="text-2xl font-bold mt-2">
                  ₹ {averageExpense}
                </h3>
              </div>

              <div>
                <p className="text-slate-500">
                  Highest Expense
                </p>

                <h3 className="text-2xl font-bold mt-2 text-red-500">
                  ₹ {highestExpense}
                </h3>
              </div>

              <div>
                <p className="text-slate-500">
                  Recommendation
                </p>

                <h3 className="text-xl font-bold mt-2 text-blue-600">
                  {recommendation}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default BudgetPage;