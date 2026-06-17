import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../../services/authService";

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Clicked Register");

        console.log({
            name,
            email,
            password,
        });

        try {
            const data = await registerUser({
                name,
                email,
                password,
            });

            console.log(data);

            alert(data.message);

        } catch (error) {
            console.log(error);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
        <AuthLayout>
            <h1 className="text-3xl font-bold text-center mb-6">
                Register
            </h1>

            <form onSubmit={handleSubmit}>
                <Input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    type="password"
                    placeholder="Create password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button 
                    text="Register" 
                    type="submit" 
                />
            </form>

            <p className="text-center mt-4 text-slate-600">
                Already have an account?{" "}
                <Link
                    to="/login"
                    className="text-blue-600 font-medium hover:underline"
                >
                    Login
                </Link>
            </p>
        </AuthLayout>
    );
}

export default RegisterPage;