import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";
import {
    createRecurringExpense,
    getRecurringExpenses,
    deleteRecurringExpense,
} from "../../services/recurringExpenseService";
import { formatCurrency } from "../../utils/currencyConverter";

function RecurringExpensesPage() {
    const user = JSON.parse(localStorage.getItem("user"));
    const currency = user?.currency || "INR";

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [frequency, setFrequency] = useState("monthly");
    const [nextDueDate, setNextDueDate] = useState("");

    const [recurringExpenses, setRecurringExpenses] = useState([]);

    const fetchRecurring = async () => {
        try {
            const data = await getRecurringExpenses();
            setRecurringExpenses(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRecurring();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await createRecurringExpense({
                title,
                amount,
                category,
                frequency,
                nextDueDate,
            });

            alert("Recurring expense added!");
            fetchRecurring();

            setTitle("");
            setAmount("");
            setCategory("");
            setFrequency("monthly");
            setNextDueDate("");

        } catch (error) {
            alert("Failed to create recurring expense");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteRecurringExpense(id);
            fetchRecurring();
            alert("Recurring expense deleted!");
        } catch (error) {
            alert("Delete failed");
        }
    };

    return (
        <DashboardLayout>
            <div className="p-8">

                <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">
                    Recurring Expenses
                </h1>

                <p className="mb-8 text-slate-500 dark:text-slate-300">
                    Manage automatic expenses
                </p>

                <div className="rounded-3xl shadow-lg p-8 max-w-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white">

                    <form onSubmit={handleSubmit}>

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
                                mb-4
                                bg-slate-50
                                border-slate-300
                                text-slate-900
                                dark:bg-slate-700
                                dark:border-slate-600
                                dark:text-white
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
                                mb-4
                                bg-slate-50
                                border-slate-300
                                text-slate-900
                                dark:bg-slate-700
                                dark:border-slate-600
                                dark:text-white
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
                                mb-4
                                bg-slate-50
                                border-slate-300
                                text-slate-900
                                dark:bg-slate-700
                                dark:border-slate-600
                                dark:text-white
                            "
                        />

                        <select
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value)}
                            className="
                                w-full
                                p-3
                                border
                                rounded-xl
                                mb-4
                                bg-slate-50
                                border-slate-300
                                text-slate-900
                                dark:bg-slate-700
                                dark:border-slate-600
                                dark:text-white
                            "
                        >
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>

                        <input
                            type="date"
                            value={nextDueDate}
                            onChange={(e) => setNextDueDate(e.target.value)}
                            className="
                                w-full
                                p-3
                                border
                                rounded-xl
                                mb-6
                                bg-slate-50
                                border-slate-300
                                text-slate-900
                                dark:bg-slate-700
                                dark:border-slate-600
                                dark:text-white
                            "
                        />

                        <button
                            type="submit"
                            className="
                                bg-blue-600
                                text-white
                                px-6
                                py-3
                                rounded-xl
                                font-semibold
                            "
                        >
                            Add Recurring Expense
                        </button>

                    </form>

                    <div className="mt-8">
                        <h2 className="text-2xl font-bold mb-4">
                            Upcoming Bills
                        </h2>

                        <div className="space-y-3">
                            {recurringExpenses.length === 0 ? (
                                <p className="text-slate-600 dark:text-slate-400">
                                    No upcoming bills 🎉
                                </p>
                            ) : (
                                recurringExpenses
                                    .slice(0, 5)
                                    .map((expense) => (
                                        <div
                                            key={expense._id}
                                            className="
                                                border p-5 rounded-2xl shadow-sm
                                                border-slate-100 bg-slate-50
                                                dark:border-slate-700 dark:bg-slate-800/50
                                            "
                                        >
                                            <h3 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                                                {expense.title}
                                            </h3>

                                            <div className="mb-3">
                                                <span
                                                    className={`
                                                        px-3
                                                        py-1
                                                        rounded-full
                                                        text-xs
                                                        font-semibold
                                                        text-white
                                                        capitalize
                                                        ${
                                                            expense.frequency === "daily"
                                                            ? "bg-yellow-500"
                                                            : expense.frequency === "weekly"
                                                            ? "bg-blue-500"
                                                            : expense.frequency === "monthly"
                                                            ? "bg-green-500"
                                                            : "bg-purple-500"
                                                        }
                                                    `}
                                                >
                                                    {expense.frequency}
                                                </span>
                                            </div>

                                            <p className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
                                                {formatCurrency(expense.amount, currency)}
                                            </p>
                                            
                                            <p className="text-sm mt-1 mb-4 text-slate-600 dark:text-slate-400">
                                                Due: {new Date(expense.nextDueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                            
                                            <button
                                                onClick={() => handleDelete(expense._id)}
                                                className="
                                                    bg-red-500
                                                    text-white
                                                    px-4
                                                    py-2
                                                    rounded-xl
                                                    text-sm
                                                    font-medium
                                                    hover:bg-red-600
                                                    transition-all
                                                "
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </DashboardLayout>
    );
}

export default RecurringExpensesPage;