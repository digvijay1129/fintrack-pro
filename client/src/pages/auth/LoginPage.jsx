import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../../services/authService";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    if (localStorage.getItem("token")) {
        navigate("/");
    }

    const handleLogin = async () => {
        try {
            const data = await loginUser({
                email,
                password,
            });

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            console.log(data);

            alert("Login Successful");

            navigate("/");
        } catch (error) {
            console.log(error);

            console.log(error.response?.data);

            alert("Login Failed");
        }
    };

    return (
        <AuthLayout>
            <h1 className="text-3xl font-bold text-center mb-6">
                Login
            </h1>

            <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                text="Login"
                onClick={handleLogin}
            />

            <div className="mt-4 text-center">
                <a
                    href="/forgot-password"
                    className="
                        text-blue-600
                        hover:underline
                    "
                >
                    Forgot Password?
                </a>
            </div>

            <p className="text-center mt-4 text-slate-600">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="text-blue-600 font-medium hover:underline"
                >
                    Register
                </Link>
            </p>
        </AuthLayout>
    );
}

export default LoginPage;