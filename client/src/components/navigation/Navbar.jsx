import {
  FaBell,
  FaSearch,
  FaSignOutAlt,
} from "react-icons/fa";

function Navbar() {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <nav
      className="
        h-20
        bg-white
        border-b
        border-slate-200
        px-8
        flex
        items-center
        justify-between
      "
    >
      {/* Left */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="text-slate-500">
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
            className="
              pl-11
              pr-4
              py-3
              w-72
              rounded-2xl
              border
              border-slate-200
              bg-slate-50
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
        </div>

        {/* Notification */}
        <button
          className="
            h-12
            w-12
            rounded-2xl
            bg-slate-100
            flex
            items-center
            justify-center
            hover:bg-slate-200
            transition-all
          "
        >
          <FaBell />
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
            <h4 className="font-semibold">
              {user?.name}
            </h4>

            <p className="text-sm text-slate-500">
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