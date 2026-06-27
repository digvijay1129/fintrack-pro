import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import { getTeamExpenses, deleteSplitExpense } from "../../services/splitExpenseService";
import AddExpenseModal from "../../components/team/AddExpenseModal";

function TeamExpensesPage() {
  const { id } = useParams();

  const [expenses, setExpenses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // Step 2.1: Added selectedExpense state
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [expandedExpense, setExpandedExpense] = useState(null);

  // Add Current User
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      const data = await getTeamExpenses(id);
      setExpenses(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Connect Delete
  const handleDelete = async (expenseId) => {
    const ok = window.confirm("Delete this expense?");
    if (!ok) return;

    try {
      await deleteSplitExpense(expenseId);
      loadExpenses();
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred while deleting");
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">
          💰 Team Expenses
        </h1>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl mb-8 font-semibold shadow hover:scale-105 transition-all"
        >
          ➕ Add Expense
        </button>

        <div className="space-y-6">
          {expenses.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-lg p-12 text-center text-slate-900 dark:text-white">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                No Shared Expenses
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">
                Create your first team expense.
              </p>
            </div>
          ) : (
            expenses.map((expense) => (
              <div
                key={expense._id}
                onClick={() =>
                  setExpandedExpense(
                    expandedExpense === expense._id ? null : expense._id
                  )
                }
                className="group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {expense.title}
                      </h2>
                      <span className="text-slate-400 group-hover:text-blue-600 transition-colors duration-300 text-[10px]">
                        {expandedExpense === expense._id ? "▲" : "▼"}
                      </span>
                    </div>
                    
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                      Paid by {expense.paidBy.name}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-4xl font-extrabold text-green-600 dark:text-green-400 mb-3 group-hover:scale-105 transition-transform duration-300 origin-right">
                      ₹{Number(expense.amount).toFixed(2)}
                    </p>
                    
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-all duration-300 group-hover:scale-105 ${
                        expense.splitType === "equal"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          : expense.splitType === "percentage"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                          : "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                      }`}
                    >
                      {expense.splitType === "equal"
                        ? "🟦 Equal"
                        : expense.splitType === "percentage"
                        ? "🟨 Percentage"
                        : "🟩 Custom"}
                    </span>

                    {/* Actions */}
                    {(expense.paidBy._id === currentUser?._id ||
                      expense.team?.owner === currentUser?._id) && (
                      <div className="flex gap-2 justify-end mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          // Step 2.2: Set selectedExpense and open modal
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExpense(expense);
                            setShowModal(true);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm shadow-md hover:scale-105 transition-all"
                        >
                          ✏ Edit
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(expense._id);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm shadow-md hover:scale-105 transition-all"
                        >
                          🗑 Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Smooth Expand/Collapse wrapper */}
                <div 
                  className={`grid transition-all duration-500 overflow-hidden ${
                    expandedExpense === expense._id 
                      ? "grid-rows-[1fr] opacity-100 mt-6" 
                      : "grid-rows-[0fr] opacity-0 mt-0"
                  }`}
                >
                  <div className="min-h-0">
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                      <div className="grid md:grid-cols-3 gap-4 mb-6">
                        <div className="rounded-2xl bg-slate-100 dark:bg-slate-700 p-4">
                          <p className="text-sm text-slate-500 dark:text-slate-400">📅 Created</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {new Date(expense.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-100 dark:bg-slate-700 p-4">
                          <p className="text-sm text-slate-500 dark:text-slate-400">💳 Paid By</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {expense.paidBy.name}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-100 dark:bg-slate-700 p-4">
                          <p className="text-sm text-slate-500 dark:text-slate-400">🧩 Split Type</p>
                          <p className="font-semibold text-slate-900 dark:text-white capitalize">
                            {expense.splitType}
                          </p>
                        </div>
                      </div>

                      {expense.description && (
                        <div className="mb-6 rounded-2xl bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-slate-700 p-5">
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                            📝 Description
                          </p>
                          <p className="text-slate-900 dark:text-white">
                            {expense.description}
                          </p>
                        </div>
                      )}

                      <h3 className="text-lg font-bold mb-5 text-slate-900 dark:text-white">
                        👥 Participants
                      </h3>
                      <div className="space-y-4">
                        {expense.participants.map((participant) => (
                          <div
                            key={participant.user._id}
                            className="flex justify-between items-center rounded-2xl bg-slate-100 dark:bg-slate-700 p-4"
                          >
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {participant.user.name}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Share : ₹{Number(participant.amount).toFixed(2)}
                              </p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Paid : ₹{participant.user._id === expense.paidBy._id ? Number(expense.amount).toFixed(2) : "0.00"}
                              </p>
                            </div>
                            {participant.user._id === expense.paidBy._id ? (
                              <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
                                🟢 Paid
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold">
                                🟡 Owes ₹{Number(participant.amount).toFixed(2)}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Step 2.3: Updated AddExpenseModal Component rendering */}
      <AddExpenseModal
        open={showModal}
        teamId={id}
        expense={selectedExpense}
        onSuccess={() => {
          loadExpenses();
          setShowModal(false);
          setSelectedExpense(null);
        }}
        onClose={() => {
          setShowModal(false);
          setSelectedExpense(null);
        }}
      />
    </DashboardLayout>
  );
}

export default TeamExpensesPage;