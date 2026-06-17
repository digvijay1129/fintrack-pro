import { useState } from "react";
import { forgotPassword } from "../../services/authService";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await forgotPassword(email);

            alert(data.message);

            console.log(
                "Reset Token:",
                data.token
            );

            setEmail("");

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
                    Forgot Password
                </h1>

                <p className="text-slate-500 mb-6">
                    Enter your email to reset your password.
                </p>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email Address"
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
                        className="
              w-full
              bg-blue-600
              text-white
              p-3
              rounded-xl
              font-semibold
            "
                    >
                        Send Reset Link
                    </button>

                </form>

            </div>
        </div>
    );
}

export default ForgotPasswordPage;