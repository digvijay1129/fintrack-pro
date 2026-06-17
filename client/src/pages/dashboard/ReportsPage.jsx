import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import { getExpenses } from "../../services/expenseService";
import { getBudget } from "../../services/budgetService";

// Step 2: Add imports
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

function ReportsPage() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState(null);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDarkMode(theme === "dark");
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expenseData = await getExpenses();
        setExpenses(expenseData);

        const budgetData = await getBudget();

        setBudget(budgetData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const totalAmount = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const remainingBudget = budget ? budget.amount - totalAmount : 0;

  const averageExpense = expenses.length
    ? (totalAmount / expenses.length).toFixed(2)
    : 0;

  // Step 3: Replace PDF Function
  const handlePDFExport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("FinTrack Report", 20, 20);

    autoTable(doc, {
      startY: 35,
      head: [["Expense", "Category", "Amount"]],
      body: expenses.map((expense) => [
        expense.title,
        expense.category,
        `₹ ${expense.amount}`,
      ]),
    });

    doc.save("FinTrack_Report.pdf");
  };

  // Step 4: Replace Excel Function
  const handleExcelExport = () => {
    const data = expenses.map((expense) => ({
      Expense: expense.title,
      Category: expense.category,
      Amount: expense.amount,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, "FinTrack_Report.xlsx");
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className={`text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Reports
        </h1>

        <p className={`mb-8 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
          Financial reports and exports
        </p>

        <div
          className={`
            rounded-3xl
            shadow-lg
            p-8
            ${darkMode
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-900"
            }
          `}
        >
          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            Reports Dashboard
          </h2>

          <div
            className="
              grid
              md:grid-cols-2
              gap-6
            "
          >
            <div>
              <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                Total Expenses
              </p>
              <h3 className="text-3xl font-bold">{expenses.length}</h3>
            </div>

            <div>
              <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                Total Spending
              </p>
              <h3 className="text-3xl font-bold text-green-600">
                ₹ {totalAmount}
              </h3>
            </div>

            <div>
              <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                Budget
              </p>
              <h3 className="text-3xl font-bold">₹ {budget?.amount || 0}</h3>
            </div>

            <div>
              <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                Remaining
              </p>
              <h3 className="text-3xl font-bold text-blue-600">
                ₹ {remainingBudget}
              </h3>
            </div>

            <div>
              <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                Average Expense
              </p>
              <h3 className="text-3xl font-bold">₹ {averageExpense}</h3>
            </div>
          </div>
        </div>

        {/* Step 1: Export Center */}
        <div
          className={`
            rounded-3xl
            shadow-lg
            p-8
            mt-6
            ${darkMode
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-900"
            }
          `}
        >
          <h2 className="text-2xl font-bold mb-6">
            Export Center
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Step 2: PDF Button */}
            <button
              onClick={handlePDFExport}
              className="
                bg-red-500
                text-white
                p-4
                rounded-2xl
                font-semibold
                hover:bg-red-600
                transition-all
                hover:scale-105
              "
            >
              📄 Export PDF
            </button>

            {/* Step 3: Excel Button */}
            <button
              onClick={handleExcelExport}
              className="
                bg-emerald-600
                text-white
                p-4
                rounded-2xl
                font-semibold
                hover:bg-emerald-700
                transition-all
                hover:scale-105
              "
            >
              📊 Export Excel
            </button>
          </div>
        </div>

        {/* Step 2: Report Statistics */}
        <div
          className={`
            rounded-3xl
            shadow-lg
            p-8
            mt-6
            ${darkMode
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-900"
            }
          `}
        >
          <h2 className="text-2xl font-bold mb-6">
            Report Summary
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                Reports Available
              </p>
              <h3 className="text-3xl font-bold">
                2
              </h3>
            </div>

            <div>
              <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                Budget Status
              </p>
              <h3 className={`text-xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                {remainingBudget >= 0 ? "Healthy" : "Exceeded"}
              </h3>
            </div>

            <div>
              <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                Average Expense
              </p>
              <h3 className="text-3xl font-bold">
                ₹ {averageExpense}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ReportsPage;