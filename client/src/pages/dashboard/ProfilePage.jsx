import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";

function ProfilePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  // Step 1: Add Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-2">Profile Settings</h1>

        <p className="text-slate-500 mb-8">Manage your account</p>

        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            p-8
            max-w-2xl
          "
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

            <p className="text-slate-500">{user?.email}</p>

            <div className="grid md:grid-cols-2 gap-4 mt-8">
              <div
                className="
                  bg-slate-50
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-slate-500">Account Type</p>

                <h3 className="text-xl font-bold mt-2">Premium</h3>
              </div>

              <div
                className="
                  bg-slate-50
                  rounded-2xl
                  p-5
                "
              >
                <p className="text-slate-500">Status</p>

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
              className="
                w-full
                p-3
                border
                rounded-xl
                mb-4
              "
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                p-3
                border
                rounded-xl
                mb-4
              "
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
          <div className="mt-10">
            <h3 className="text-2xl font-bold mb-4">Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="
                w-full
                p-3
                border
                rounded-xl
                mb-4
              "
            />

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="
                w-full
                p-3
                border
                rounded-xl
                mb-4
              "
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="
                w-full
                p-3
                border
                rounded-xl
                mb-4
              "
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