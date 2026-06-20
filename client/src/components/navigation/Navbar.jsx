import {
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { 
  getNotifications, 
  markAsRead 
} from "../../services/notificationService";

function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const activeNotifications = notifications.filter((notification) => {
    if (!notification.month) return true;
    return (
      notification.month === currentMonth &&
      notification.year === currentYear
    );
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(
      fetchNotifications,
      5000
    );

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications(
        notifications.map((n) =>
          n._id === id
            ? {
                ...n,
                isRead: true,
              }
            : n
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const unreadCount = activeNotifications.filter((n) => !n.isRead).length;

  return (
    <nav
      className={`
        h-20
        px-8
        flex
        items-center
        justify-between
        border-b
        ${
          darkMode
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-slate-200"
        }
      `}
    >
      {/* Left */}
      <div>
        <h1 className={`
          text-3xl
          font-bold
          ${
            darkMode
            ? "text-white"
            : "text-slate-900"
          }
        `}>
          Dashboard
        </h1>

        <p className={
          darkMode
          ? "text-slate-300"
          : "text-slate-500"
        }>
          Manage your finances
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Search */}
        <div className="relative hidden md:block">
          <FaSearch
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            placeholder="Search..."
            className={`
              pl-11
              pr-4
              py-3
              w-72
              rounded-2xl
              border
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              ${
                darkMode
                ? "bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                : "bg-slate-50 border-slate-200"
              }
            `}
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`
            h-12
            w-12
            rounded-2xl
            flex
            items-center
            justify-center
            transition-all
            hover:scale-105
            ${
              darkMode
              ? "bg-slate-800 text-yellow-400"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }
          `}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notification */}
        <div className="relative">
          <button
            onClick={async () => {
              await fetchNotifications();
              setShowNotifications(!showNotifications);
            }}
            className="
              h-12
              w-12
              rounded-2xl
              bg-slate-100
              text-slate-700
              dark:bg-slate-800
              dark:text-white
              flex
              items-center
              justify-center
              hover:bg-slate-200
              dark:hover:bg-slate-700
              transition-all
            "
          >
            <FaBell className="text-lg" />
          </button>

          {unreadCount > 0 && (
            <span
              className="
                absolute
                -top-1
                -right-1
                h-5
                w-5
                rounded-full
                bg-red-500
                text-white
                text-xs
                flex
                items-center
                justify-center
              "
            >
              {unreadCount}
            </span>
          )}

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div
              className="
                absolute
                right-0
                top-14
                w-80
                rounded-2xl
                bg-white
                dark:bg-slate-900
                border
                border-slate-200
                dark:border-slate-700
                shadow-xl
                z-50
              "
            >
              <div
                className="
                  p-4
                  border-b
                  dark:border-slate-700
                  font-semibold
                  dark:text-white
                "
              >
                Notifications
              </div>

              <div className="max-h-80 overflow-y-auto">
                {activeNotifications.length === 0 ? (
                  <p
                    className="
                      p-4
                      text-slate-500
                    "
                  >
                    No notifications
                  </p>
                ) : (
                  activeNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => handleRead(notification._id)}
                      className="
                        p-4
                        border-b
                        cursor-pointer
                        hover:bg-slate-100
                        dark:hover:bg-slate-800
                        dark:border-slate-700
                      "
                    >
                      <p
                        className={
                          notification.isRead
                            ? "dark:text-white"
                            : "font-bold dark:text-white"
                        }
                      >
                        {notification.message}
                      </p>

                      <p
                        className="
                          text-xs
                          text-slate-500
                          mt-1
                        "
                      >
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-3">
          <div
            className="
              h-12
              w-12
              rounded-full
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              flex
              items-center
              justify-center
              text-white
              font-bold
            "
          >
            {user?.name?.charAt(0)}
          </div>

          <div>
            <h4 className="font-semibold dark:text-white">
              {user?.name}
            </h4>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Premium User
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="
            flex
            items-center
            gap-2
            px-4
            py-3
            rounded-xl
            bg-red-50
            text-red-600
            hover:bg-red-100
            transition-all
          "
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;