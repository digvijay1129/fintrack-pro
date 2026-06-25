import { Routes, Route } from "react-router-dom";



import DashboardPage from "../pages/dashboard/DashboardPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ProtectedRoute from "./ProtectedRoute";
import ExpensesPage from "../pages/dashboard/ExpensesPage";
import ProfilePage from "../pages/dashboard/ProfilePage";
import BudgetPage from "../pages/dashboard/BudgetPage";
import ReportsPage from "../pages/dashboard/ReportsPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";
import RecurringExpensesPage from "../pages/dashboard/RecurringExpensesPage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminRoute from "./AdminRoute";
import AdminUsersPage
  from "../pages/admin/AdminUsersPage";
import TeamsPage
  from "../pages/team/TeamsPage";
import TeamDetailsPage
  from "../pages/team/TeamDetailsPage";
import InvitationsPage
  from "../pages/team/InvitationsPage";

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
        path="/recurring-expenses"
        element={<RecurringExpensesPage />}
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

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminRoute>
              <AdminUsersPage />
            </AdminRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/teams"
        element={
          <ProtectedRoute>
            <TeamsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teams/:id"
        element={
          <ProtectedRoute>
            <TeamDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/team-invitations"
        element={<InvitationsPage />}
      />

      <Route path="/login" element={<LoginPage />} />

      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />

      <Route
        path="/reset-password/:token"
        element={<ResetPasswordPage />}
      />

    </Routes>
  );
}

export default AppRoutes;