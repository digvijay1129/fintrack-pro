import {
  FaTachometerAlt,
  FaUsers,
} from "react-icons/fa";

import { Link } from "react-router-dom";
import { useState } from "react";

function AdminSidebar() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div
      className="
        w-64
        min-h-screen
        bg-slate-900
        text-white
        p-6
        flex
        flex-col
      "
    >
      <h2
        className="
          text-2xl
          font-bold
          mb-10
        "
      >
        Admin Panel
      </h2>

      <div className="space-y-4 flex flex-col">
        <Link
          to="/admin"
          className="
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            hover:bg-slate-800
          "
        >
          <FaTachometerAlt />
          Dashboard
        </Link>

        <Link
          to="/admin/users"
          className="
            flex
            items-center
            gap-3
            p-3
            rounded-xl
            hover:bg-slate-800
          "
        >
          <FaUsers />
          Users
        </Link>
      </div>

      <div className="mt-auto pt-10">
        <button
          onClick={() => setShowLogoutModal(true)}
          className="
            w-full
            bg-red-500
            hover:bg-red-600
            text-white
            py-3
            rounded-xl
            font-semibold
          "
        >
          Logout
        </button>
      </div>

      {showLogoutModal && (
        <div
          className="
            fixed
            inset-0
            bg-black/50
            flex
            items-center
            justify-center
            z-50
          "
        >
          <div
            className="
              bg-white
              text-slate-900
              rounded-2xl
              p-6
              w-96
              shadow-xl
            "
          >
            <h2
              className="
                text-xl
                font-bold
                mb-2
              "
            >
              Logout?
            </h2>

            <p
              className="
                text-slate-600
                mb-6
              "
            >
              Are you sure you want to logout?
            </p>

            <div
              className="
                flex
                justify-end
                gap-3
              "
            >
              <button
                onClick={() => setShowLogoutModal(false)}
                className="
                  px-4
                  py-2
                  bg-slate-200
                  text-slate-900
                  rounded-lg
                "
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="
                  px-4
                  py-2
                  bg-red-500
                  text-white
                  rounded-lg
                "
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSidebar;