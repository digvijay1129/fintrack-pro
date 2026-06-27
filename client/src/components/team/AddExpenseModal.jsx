import { useState, useEffect } from "react";
import { getTeamById } from "../../services/teamService";
// Step 3.1: Update imports to include updateSplitExpense
import {
  createSplitExpense,
  updateSplitExpense,
} from "../../services/splitExpenseService";

// Step 1.1: Updated props to include expense and onSuccess
function AddExpenseModal({ open, onClose, teamId, expense = null, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [splitType, setSplitType] = useState("equal");
  const [loading, setLoading] = useState(false);

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!open || !teamId) return;
    loadMembers();
  }, [open, teamId]);

  // Step 1.2: Added useEffect to populate state for editing an expense
  useEffect(() => {
    if (!expense) return;

    setTitle(expense.title);
    setDescription(expense.description || "");
    setAmount(expense.amount);
    setSplitType(expense.splitType);

    setParticipants(
      expense.participants.map((participant) => ({
        user: participant.user._id || participant.user,
        checked: true,
        percentage: participant.percentage || "",
        amount: participant.amount || "",
      }))
    );
  }, [expense]);

  const loadMembers = async () => {
    try {
      const teamData = await getTeamById(teamId);
      setTeam(teamData);
      setMembers(teamData.members);
      setParticipants(
        teamData.members.map((member) => ({
          user: member._id,
          checked: true,
          percentage: "",
          amount: "",
        }))
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Step 3.2: Replaced handleSaveExpense with handleSave
  const handleSave = async () => {
    try {
      setLoading(true);

      const expenseData = {
        teamId, // Keeping teamId from your original structure to match backend requirements
        title,
        description,
        amount: Number(amount),
        splitType,
        participants:
          splitType === "equal"
            ? participants
                .filter((p) => p.checked)
                .map((p) => ({
                  user: p.user,
                }))
            : splitType === "percentage"
            ? participants.map((p) => ({
                user: p.user,
                percentage: Number(p.percentage),
              }))
            : participants.map((p) => ({
                user: p.user,
                amount: Number(p.amount),
              })),
      };

      if (expense) {
        await updateSplitExpense(expense._id, expenseData);
      } else {
        await createSplitExpense(expenseData);
      }

      // Step 3.4: Clear form state on success before closing
      if (onSuccess) {
        setTitle("");
        setDescription("");
        setAmount("");
        setSplitType("equal");
        setParticipants([]);

        onSuccess();
      }
      onClose();
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white">
        {/* Step 1.3: Dynamic modal heading */}
        <h2 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
          {expense ? "✏ Edit Team Expense" : "➕ Add Team Expense"}
        </h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Expense Title"
          className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-4 mb-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
        />

        <textarea
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-4 mb-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
        />

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-4 mb-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
        />

        <select
          value={splitType}
          onChange={(e) => setSplitType(e.target.value)}
          className="w-full border border-slate-300 dark:border-slate-700 rounded-xl p-4 mb-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
        >
          <option value="equal">Equal</option>
          <option value="percentage">Percentage</option>
          <option value="custom">Custom</option>
        </select>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {members.map((member, index) => (
            <div key={member._id}>
              {splitType === "equal" ? (
                <div
                  onClick={() => {
                    const updated = [...participants];
                    updated[index].checked = !updated[index].checked;
                    setParticipants(updated);
                  }}
                  className={`cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 ${
                    participants[index]?.checked
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg scale-[1.02]"
                      : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-400 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${participants[index]?.checked ? "bg-green-600" : "bg-blue-600"}`}>
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white">{member.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {member._id === team?.owner?._id ? "👑 Team Owner" : "👤 Team Member"}
                      </p>
                    </div>
                    <div className="text-2xl">{participants[index]?.checked ? "🟢" : "⚪"}</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-slate-700 dark:text-white">{member.name}</span>
                  </div>
                  {splitType === "percentage" && (
                    <input
                      type="number"
                      placeholder="%"
                      className="border border-slate-300 dark:border-slate-700 rounded-lg p-2 w-20 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      value={participants[index]?.percentage || ""}
                      onChange={(e) => {
                        const updated = [...participants];
                        updated[index].percentage = e.target.value;
                        setParticipants(updated);
                      }}
                    />
                  )}
                  {splitType === "custom" && (
                    <input
                      type="number"
                      placeholder="₹"
                      className="border border-slate-300 dark:border-slate-700 rounded-lg p-2 w-24 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      value={participants[index]?.amount || ""}
                      onChange={(e) => {
                        const updated = [...participants];
                        updated[index].amount = e.target.value;
                        setParticipants(updated);
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            onClick={() => {
              setTitle("");
              setDescription("");
              setAmount("");
              setSplitType("equal");
              setParticipants([]);
              onClose();
            }}
            className="px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            // Step 3.3: Connect handleSave here
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-md disabled:opacity-50 transition-colors"
          >
            {/* Step 1.4: Dynamic Save button text */}
            {loading ? "Saving..." : (expense ? "Update Expense" : "Save Expense")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddExpenseModal;