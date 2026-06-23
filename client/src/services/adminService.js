import axios from "axios";

const API_URL =
  "http://localhost:5000/api/admin";

const getConfig = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };
};

export const getUserCount =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/stats/users`,
        getConfig()
      );

    return response.data;
};

export const getExpenseCount =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/stats/expenses`,
        getConfig()
      );

    return response.data;
};

export const getBudgetCount =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/stats/budgets`,
        getConfig()
      );

    return response.data;
};

export const getAllUsers =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/users`,
        getConfig()
      );

    return response.data;
};

export const deleteUser =
  async (id) => {

    const response =
      await axios.delete(
        `${API_URL}/users/${id}`,
        getConfig()
      );

    return response.data;
};

export const getRecentUsers =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/recent-users`,
        getConfig()
      );

    return response.data;
};

export const getAdminNotifications =
  async () => {

    const response =
      await axios.get(
        `${API_URL}/notifications`,
        getConfig()
      );

    return response.data;
};