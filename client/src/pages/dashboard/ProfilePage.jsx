import DashboardLayout from "../../layouts/DashboardLayout";
import { useState, useEffect } from "react";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Step 1: Add Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setDarkMode(theme === "dark");
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className={`text-4xl font-bold mb-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Profile Settings
        </h1>

        <p className={`mb-8 ${darkMode ? "text-slate-300" : "text-slate-500"}`}>
          Manage your account
        </p>

        <div
          className={`
            rounded-3xl
            shadow-lg
            p-8
            max-w-2xl
            ${
              darkMode
              ? "bg-slate-800 text-white"
              : "bg-white text-slate-900"
            }
          `}
        >
          <div className="mb-6">
            <div
              className="
                h-20
                w-20
                rounded-full
                bg-gradient-to-r
                from-blue-500
                to-indigo-500
                flex
                items-center
                justify-center
                text-white
                text-3xl
                font-bold
                mb-4
              "
            >
              {user?.name?.charAt(0)}
            </div>

            <h2 className="text-2xl font-bold">{user?.name}</h2>

            <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
              {user?.email}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div
                className={`
                  rounded-2xl
                  p-5
                  ${
                    darkMode
                    ? "bg-slate-700"
                    : "bg-slate-50"
                  }
                `}
              >
                <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                  Account Type
                </p>

                <h3 className="text-xl font-bold mt-2">Premium</h3>
              </div>

              <div
                className={`
                  rounded-2xl
                  p-5
                  ${
                    darkMode
                    ? "bg-slate-700"
                    : "bg-slate-50"
                  }
                `}
              >
                <p className={darkMode ? "text-slate-300" : "text-slate-500"}>
                  Status
                </p>

                <h3 className="text-xl font-bold mt-2 text-green-600">
                  Active
                </h3>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4">Edit Profile</h3>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`
                w-full
                p-3
                border
                rounded-xl
                mb-4
                ${
                  darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300"
                }
              `}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`
                w-full
                p-3
                border
                rounded-xl
                mb-4
                ${
                  darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300"
                }
              `}
            />

            <button
              onClick={() => {
                const updatedUser = {
                  ...user,
                  name,
                  email,
                };

                localStorage.setItem("user", JSON.stringify(updatedUser));

                alert("Profile Updated");

                window.location.reload();
              }}
              className="
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
              "
            >
              Save Changes
            </button>
          </div>

          {/* Step 2: Add Change Password Section */}
          <div
            className={`
              mt-10
              pt-8
              border-t
              ${
                darkMode
                ? "border-slate-700"
                : "border-slate-200"
              }
            `}
          >
            <h3 className="text-2xl font-bold mb-4">Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`
                w-full
                p-3
                border
                rounded-xl
                mb-4
                ${
                  darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300"
                }
              `}
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`
                w-full
                p-3
                border
                rounded-xl
                mb-4
                ${
                  darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300"
                }
              `}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`
                w-full
                p-3
                border
                rounded-xl
                mb-4
                ${
                  darkMode
                  ? "bg-slate-700 border-slate-600 text-white"
                  : "bg-white border-slate-300"
                }
              `}
            />

            {/* Step 3: Add Update Password Button */}
            <button
              onClick={() => {
                if (newPassword !== confirmPassword) {
                  alert("Passwords do not match");
                  return;
                }

                alert("Password Update UI Ready");

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="
                bg-emerald-600
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
              "
            >
              Update Password
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ProfilePage;