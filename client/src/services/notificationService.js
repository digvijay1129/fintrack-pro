import axios from "axios";

const API = "http://localhost:5000/api/notifications";

const getNotifications = async () => {
  const token = localStorage.getItem("token");
  
  const response = await axios.get(
    API,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
};

const markAsRead = async (id) => {
  const token = localStorage.getItem("token");
  
  const response = await axios.put(
    `${API}/${id}`,
    {}, // empty body
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  
  return response.data;
};

export {
  getNotifications,
  markAsRead,
};