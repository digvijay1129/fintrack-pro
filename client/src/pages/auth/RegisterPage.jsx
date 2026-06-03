import AuthLayout from "../../layouts/AuthLayout";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";

function RegisterPage() {
    return (
        <AuthLayout>
            <h1 className="text-3xl font-bold text-center mb-6">
                Register
            </h1>

            <Input
                type="text"
                placeholder="Enter your full name"
            />

            <Input
                type="email"
                placeholder="Enter your email"
            />

            <Input
                type="password"
                placeholder="Create password"
            />

            <Button text="Register" />
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