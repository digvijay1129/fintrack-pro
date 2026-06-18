import axios from "axios";

const API_URL =
  "http://localhost:5000/api/recurring-expenses";

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Get All
export const getRecurringExpenses =
async () => {

  const response =
  await axios.get(
    API_URL,
    getConfig()
  );

  return response.data;
};

// Create
export const createRecurringExpense =
async (expenseData) => {

  const response =
  await axios.post(
    API_URL,
    expenseData,
    getConfig()
  );

  return response.data;
};

// Delete
export const deleteRecurringExpense =
async (id) => {

  const response =
  await axios.delete(
    `${API_URL}/${id}`,
    getConfig()
  );

  return response.data;
};