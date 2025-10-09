// src/layouts/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
// Add Users icon
import {
  Home,
  BarChart3,
  Database,
  User,
  LogOut,
  Edit,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-[250px] flex-shrink-0 bg-white/80 backdrop-blur-md border-r flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-10 tracking-tight text-blue-600">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-3">
          {/* ... other NavLinks ... */}
          <NavLink
            to="/home"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`
            }
          >
            {" "}
            <Home size={18} /> Home{" "}
          </NavLink>
          {/* ... */}
          <NavLink
            to="/manage-users" // Add this link
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`
            }
          >
            <Users size={18} /> Manage Users
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`
            }
          >
            <User size={18} /> Profile
          </NavLink>
        </nav>
        {/* header with logout */}
        <div className="mt-auto">
          <button
            onClick={handleSignOut}
            className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 text-sm text-red-600"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
      <main className="flex-1 bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
