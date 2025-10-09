// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import AdminLayout from "./layouts/AdminLayout";
import DepartmentLayout from "./layouts/DepartmentLayout";

// Import the actual pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import DataEntryPage from "./pages/DataEntryPage";
import ManageUsersPage from "./pages/ManageUsersPage";

const NotFoundPage = () => (
  <div className="flex h-screen items-center justify-center">
    404 - Page Not Found
  </div>
);

// A component to protect routes inside a layout
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
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

  // NOTE: There is NO <Router> component here.
  // It is correctly placed in your main.jsx file.
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
          <Route path="/data-entry" element={<DataEntryPage />} />
          <Route path="/manage-users" element={<ManageUsersPage />} />
        </Route>
      )}

      {/* Department User Routes */}
      {user?.role === "user" && (
        <Route
          element={
            <ProtectedRoute>
              <DepartmentLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/data-entry" element={<DataEntryPage />} />
          {/* Add other user routes here, e.g., /data-table */}
        </Route>
      )}

      {/* Redirect logic for the root path */}
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
