import axios from "axios";

const API_URL =
  "http://localhost:5000/api/budgets";

export const createBudget = async (
  budgetData
) => {
  const response = await axios.post(
    API_URL,
    budgetData,
    getConfig()
  );

  return response.data;
};

export const getBudget =
  async () => {

    const response =
      await axios.get(
        API_URL,
        getConfig()
      );

    return response.data;

  };

const getConfig = () => {
  const token =
    localStorage.getItem(
      "token"
    );

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
};