import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
} from "../../services/adminService";
import AdminSidebar from "../../components/admin/AdminSidebar";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(selectedUserId);
      await fetchUsers();

      window.dispatchEvent(
        new Event("admin-refresh")
      );

      setShowDeleteModal(false);
      setSelectedUserId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const totalUsers = users.length;

  const totalAdmins = users.filter(
    (user) => user.role === "admin"
  ).length;

  const totalNormalUsers = users.filter(
    (user) => user.role !== "admin"
  ).length;

  const filteredUsers = users.filter(
    (user) =>
      user.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      user.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div
          className="
            mb-8
            p-8
            rounded-3xl
            bg-gradient-to-r
            from-blue-600
            to-purple-600
            text-white
            shadow-xl
          "
        >
          <h1
            className="
              text-4xl
              font-bold
              mb-2
            "
          >
            Users Management
          </h1>

          <p className="text-white/80">
            Monitor and manage platform users
          </p>
        </div>

        <div
          className="
            grid
            md:grid-cols-3
            gap-6
            mb-8
          "
        >
          <div
            className="
              bg-blue-600
              text-white
              p-6
              rounded-3xl
              shadow-xl
            "
          >
            <p>Total Users</p>

            <h2
              className="
                text-4xl
                font-bold
              "
            >
              {totalUsers}
            </h2>
          </div>

          <div
            className="
              bg-purple-600
              text-white
              p-6
              rounded-3xl
              shadow-xl
            "
          >
            <p>Admins</p>

            <h2
              className="
                text-4xl
                font-bold
              "
            >
              {totalAdmins}
            </h2>
          </div>

          <div
            className="
              bg-green-600
              text-white
              p-6
              rounded-3xl
              shadow-xl
            "
          >
            <p>Users</p>

            <h2
              className="
                text-4xl
                font-bold
              "
            >
              {totalNormalUsers}
            </h2>
          </div>
        </div>

        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="
            w-full
            p-4
            rounded-2xl
            border
            mb-6
            outline-none
            focus:ring-2
            focus:ring-blue-500
          "
        />

        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
            mb-8
          "
        >
          {filteredUsers.length === 0 ? (
            <div
              className="
                col-span-full
                bg-white
                rounded-3xl
                p-12
                text-center
                shadow-lg
              "
            >
              <div className="text-6xl mb-4">
                👥
              </div>

              <h2
                className="
                  text-2xl
                  font-bold
                  mb-2
                "
              >
                No Users Found
              </h2>

              <p
                className="
                  text-slate-500
                "
              >
                Try another search.
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="
                  bg-white
                  rounded-3xl
                  shadow-lg
                  p-6
                  hover:scale-[1.02]
                  transition-all
                  duration-300
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-4
                    mb-4
                  "
                >
                  <div
                    className="
                      w-14
                      h-14
                      rounded-full
                      bg-blue-600
                      text-white
                      flex
                      items-center
                      justify-center
                      text-xl
                      font-bold
                    "
                  >
                    {user.name.charAt(0)}
                  </div>

                  <div>
                    <h3
                      className="
                        font-bold
                        text-lg
                      "
                    >
                      {user.name}
                    </h3>

                    <p
                      className="
                        text-sm
                        text-slate-500
                      "
                    >
                      {user.email}
                    </p>
                  </div>
                </div>

                <div
                  className="
                    flex
                    justify-between
                    items-center
                    mb-4
                  "
                >
                  <span
                    className={
                      user.role === "admin"
                        ? `
                          px-3
                          py-1
                          rounded-full
                          bg-purple-100
                          text-purple-700
                          font-semibold
                        `
                        : `
                          px-3
                          py-1
                          rounded-full
                          bg-green-100
                          text-green-700
                          font-semibold
                        `
                    }
                  >
                    {user.role}
                  </span>

                  <span
                    className="
                      text-xs
                      text-slate-500
                    "
                  >
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>

                {user.role !== "admin" && (
                  <button
                    onClick={() => {
                      setSelectedUserId(user._id);
                      setShowDeleteModal(true);
                    }}
                    className="
                      w-full
                      bg-red-500
                      hover:bg-red-600
                      text-white
                      py-2
                      rounded-xl
                    "
                  >
                    Delete User
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Hidden old container for backup */}
        <div
          className="
            hidden
            bg-white
            rounded-3xl
            shadow-lg
            p-6
          "
        >
          {/* Old table kept for backup */}
        </div>

        {showDeleteModal && (
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
                rounded-3xl
                p-6
                w-[400px]
              "
            >
              <h2
                className="
                  text-2xl
                  font-bold
                  mb-4
                "
              >
                Delete User
              </h2>

              <p className="mb-6">
                Are you sure?
              </p>

              <div
                className="
                  flex
                  justify-end
                  gap-3
                "
              >
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-gray-300
                  "
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteUser}
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-red-600
                    text-white
                  "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;