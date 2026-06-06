import { Routes, Route } from "react-router-dom";



import DashboardPage from "../pages/dashboard/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ExpensesPage from "../pages/dashboard/ExpensesPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
import BudgetPage from "../pages/dashboard/BudgetPage";
import ReportsPage from "../pages/dashboard/ReportsPage";

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/expenses"
        element={<ExpensesPage />}
      />

      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />

      <Route
        path="/profile"
        element={<ProfilePage />}
      />

      <Route
        path="/budget"
        element={<BudgetPage />}
      />

      <Route
        path="/reports"
        element={<ReportsPage />}
      />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default AppRoutes;