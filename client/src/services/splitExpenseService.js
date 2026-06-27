import axios from "axios";

const API_URL =
  "http://localhost:5000/api/split-expenses";

const getConfig = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`,
  },
});

// Create Expense
export const createSplitExpense =
  async (expenseData) => {

    const response =
      await axios.post(
        API_URL,
        expenseData,
        getConfig()
      );

    return response.data;

};

// Get Team Expenses
export const getTeamExpenses =
  async (teamId) => {

    const response =
      await axios.get(
        `${API_URL}/team/${teamId}`,
        getConfig()
      );

    return response.data;

};

// Update Expense
export const updateSplitExpense =
  async (
    id,
    expenseData
  ) => {

    const response =
      await axios.put(
        `${API_URL}/${id}`,
        expenseData,
        getConfig()
      );

    return response.data;

};

// Delete Expense
export const deleteSplitExpense =
  async (id) => {

    const response =
      await axios.delete(
        `${API_URL}/${id}`,
        getConfig()
      );

    return response.data;

};