// src/layouts/AdminLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { Home, BarChart3, Database, User, LogOut, Edit } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { signOut } = useAuth();
  return (
    <div className="flex min-h-screen">
      <div className="w-[250px] flex-shrink-0 bg-white/80 backdrop-blur-md border-r flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-10 tracking-tight text-blue-600">
          Admin Panel
        </h2>
        <nav className="flex flex-col gap-3">
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
          <NavLink
            to="/analysis"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`
            }
          >
            {" "}
            <BarChart3 size={18} /> Analysis{" "}
          </NavLink>
          <NavLink
            to="/data-entry"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`
            }
          >
            {" "}
            <Edit size={18} /> Entry{" "}
          </NavLink>
          <NavLink
            to="/data-table"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`
            }
          >
            {" "}
            <Database size={18} /> Data{" "}
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`
            }
          >
            {" "}
            <User size={18} /> Profile{" "}
          </NavLink>
        </nav>
        <button
          onClick={signOut}
          className="mt-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
      <main className="flex-1 bg-gray-50 p-8">
        <Outlet />
      </main>
    </div>
  );
}
