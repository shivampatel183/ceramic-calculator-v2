// src/layouts/DepartmentLayout.jsx
import { NavLink, Outlet } from "react-router-dom";
import { Database, LogOut, Edit } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function DepartmentLayout() {
  const { user, signOut } = useAuth();
  return (
    <div className="flex min-h-screen">
      <div className="w-[250px] flex-shrink-0 bg-white/80 backdrop-blur-md border-r flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-4 tracking-tight text-blue-600">
          {user?.ceramic_name || "Ceramic App"}
        </h2>
        <p className="text-sm text-gray-500 mb-10">Dept: {user?.department}</p>
        <nav className="flex flex-col gap-3">
          <NavLink
            to="/data-entry"
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg ${
                isActive ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`
            }
          >
            {" "}
            <Edit size={18} /> Data Entry{" "}
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
            <Database size={18} /> View Data{" "}
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
