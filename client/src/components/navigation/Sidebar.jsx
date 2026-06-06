import { Link } from "react-router-dom";
import {
  FaHome,
  FaWallet,
  FaBullseye,
  FaChartLine,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Expenses",
      path: "/expenses",
      icon: <FaWallet />,
    },
    {
      name: "Budget",
      path: "/budget",
      icon: <FaBullseye />,
    },

    {
      name: "Reports",
      path: "/reports",
      icon: <FaChartLine />,
    },
    {
      name: "Profile",
      path: "/profile",
      icon: <FaCog />,
    }
  ];

  return (
    <aside
      className="
        w-72
        min-h-screen
        bg-slate-950
        text-white
        flex
        flex-col
        border-r
        border-slate-800
      "
    >
      {/* Logo */}
      <div className="p-8 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              flex
              items-center
              justify-center
              text-xl
            "
          >
            💰
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              FinTrack
            </h1>

            <p className="text-slate-400 text-sm">
              Finance SaaS
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 p-5">
        <p
          className="
            text-xs
            uppercase
            text-slate-500
            mb-4
            tracking-widest
          "
        >
          Main Menu
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="
      flex
      items-center
      gap-3
      p-4
      rounded-2xl
      hover:bg-slate-800
      transition-all
      duration-300
      font-medium
    "
            >
              <span className="text-lg">
                {item.icon}
              </span>

              <span>
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom User Card */}
      <div className="p-5 border-t border-slate-800">
        <div
          className="
            bg-slate-900
            rounded-2xl
            p-4
            flex
            items-center
            gap-3
          "
        >
          <div
            className="
              h-12
              w-12
              rounded-full
              bg-gradient-to-r
              from-blue-500
              to-indigo-500
              flex
              items-center
              justify-center
              font-bold
            "
          >
            S
          </div>

          <div>
            <h4 className="font-semibold">
              Saksham
            </h4>

            <p className="text-slate-400 text-sm">
              Premium User
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;