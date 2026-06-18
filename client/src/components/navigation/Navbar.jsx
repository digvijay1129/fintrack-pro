import {
  FaBell,
  FaSearch,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useState, useEffect } from "react";

function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

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
        <button
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