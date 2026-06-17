import { useState } from "react";
import { useParams } from "react-router-dom";
import { resetPassword }
    from "../../services/authService";

function ResetPasswordPage() {
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const data = await resetPassword(
                token,
                password
            );

            alert(data.message);

            setPassword("");
            setConfirmPassword("");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );

        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold mb-2">
                    Reset Password
                </h1>

                <p className="text-slate-500 mb-6">
                    Create a new password.
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
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
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        className="
              w-full
              p-3
              border
              rounded-xl
              mb-4
            "
                    />

                    <button
                        className="
              w-full
              bg-emerald-600
              text-white
              p-3
              rounded-xl
              font-semibold
            "
                    >
                        Reset Password
                    </button>

                </form>

            </div>

        </div>
    );
}

export default ResetPasswordPage;