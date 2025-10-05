// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AdminLayout from "./layouts/AdminLayout";
import DepartmentLayout from "./layouts/DepartmentLayout";

// Import the actual pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
// import AnalysisPage from "./pages/AnalysisPage"; // We will create this
import DataEntryPage from "./pages/DataEntryPage";
// import DataTablePage from "./pages/DataTablePage"; // We will create this
// import ProfilePage from "./pages/ProfilePage"; // We will create this
const NotFoundPage = () => (
  <div className="flex h-screen items-center justify-center">
    404 - Page Not Found
  </div>
);

// A component to protect routes
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>; // Or a spinner component
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading Application...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/register"
        element={!user ? <RegisterPage /> : <Navigate to="/" />}
      />

      {/* Admin Routes */}
      {user?.role === "admin" && (
        <Route
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/data-table" element={<DataTablePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      )}

      {/* Department User Routes */}
      {user?.role === "department_user" && (
        <Route
          element={
            <ProtectedRoute>
              <DepartmentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/data-table" element={<DataTablePage />} />
        </Route>
      )}

      {/* Redirect logic */}
      <Route
        path="/"
        element={
          <Navigate
            to={
              !user ? "/login" : user.role === "admin" ? "/home" : "/data-entry"
            }
          />
        }
      />

      {/* Fallback for any other route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
