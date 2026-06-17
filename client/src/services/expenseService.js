import axios from "axios";

const API_URL =
  "http://localhost:5000/api/expenses";

const getConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getExpenses = async () => {
  const response = await axios.get(
    API_URL,
    getConfig()
  );

  return response.data;
};

export const createExpense = async (
  expenseData
) => {
  const response = await axios.post(
    API_URL,
    expenseData,
    getConfig()
  );

  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    getConfig()
  );

  return response.data;
};

export const updateExpense = async (
  id,
  expenseData
) => {
  const response = await axios.put(
`${API_URL}/${id}`,
expenseData,
getConfig()
);

  return response.data;
};