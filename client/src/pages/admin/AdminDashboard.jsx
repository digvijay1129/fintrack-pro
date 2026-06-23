import { useEffect, useState } from "react";
import {
  getUserCount,
  getExpenseCount,
  getBudgetCount,
  getRecentUsers,
  getAdminNotifications,
} from "../../services/adminService";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminDashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalBudgets, setTotalBudgets] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const usersRes = await getUserCount();
      const expensesRes = await getExpenseCount();
      const budgetsRes = await getBudgetCount();
      const recentUsersRes = await getRecentUsers();
      const notificationsRes = await getAdminNotifications();

      setTotalUsers(usersRes.totalUsers);
      setTotalExpenses(expensesRes.totalExpenses);
      setTotalBudgets(budgetsRes.totalBudgets);
      setRecentUsers(recentUsersRes);
      setNotifications(notificationsRes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const refreshDashboard = () => {
      fetchDashboard();
    };

    window.addEventListener("admin-refresh", refreshDashboard);

    return () => {
      window.removeEventListener("admin-refresh", refreshDashboard);
    };
  }, []);

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <h1
          className="
            text-4xl
            font-bold
            mb-8
          "
        >
          Admin Dashboard
        </h1>

        <div
          className="
            grid
            md:grid-cols-3
            gap-6
          "
        >
          <div
            className="
              p-6
              rounded-3xl
              bg-blue-600
              text-white
            "
          >
            <h2>Total Users</h2>

            <p
              className="
                text-4xl
                font-bold
              "
            >
              {totalUsers}
            </p>
          </div>

          <div
            className="
              p-6
              rounded-3xl
              bg-green-600
              text-white
            "
          >
            <h2>Total Expenses</h2>

            <p
              className="
                text-4xl
                font-bold
              "
            >
              {totalExpenses}
            </p>
          </div>

          <div
            className="
              p-6
              rounded-3xl
              bg-purple-600
              text-white
            "
          >
            <h2>Total Budgets</h2>

            <p
              className="
                text-4xl
                font-bold
              "
            >
              {totalBudgets}
            </p>
          </div>
        </div>

        <div
          className="
            mt-8
            bg-white
            rounded-3xl
            shadow-lg
            p-6
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            🔔 Admin Notifications
          </h2>

          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p
                className="
                  text-slate-500
                "
              >
                No notifications yet
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="
                    p-4
                    rounded-2xl
                    bg-slate-50
                    hover:bg-slate-100
                    transition-all
                  "
                >
                  <h3
                    className="
                      font-semibold
                    "
                  >
                    {notification.title}
                  </h3>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          className="
            mt-8
            bg-white
            rounded-3xl
            shadow-lg
            p-6
          "
        >
          <h2
            className="
              text-2xl
              font-bold
              mb-6
            "
          >
            Recent Users
          </h2>

          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div
                key={user._id}
                className="
                  flex
                  items-center
                  justify-between
                  p-4
                  rounded-2xl
                  bg-slate-50
                  hover:bg-slate-100
                  transition-all
                "
              >
                <div>
                  <p
                    className="
                      font-semibold
                    "
                  >
                    {user.name}
                  </p>

                  <p
                    className="
                      text-sm
                      text-slate-500
                    "
                  >
                    {user.email}
                  </p>
                </div>

                <div
                  className="
                    text-right
                  "
                >
                  <span
                    className={
                      user.role === "admin"
                        ? "text-red-600 font-semibold"
                        : "text-green-600 font-semibold"
                    }
                  >
                    {user.role}
                  </span>

                  <p
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;