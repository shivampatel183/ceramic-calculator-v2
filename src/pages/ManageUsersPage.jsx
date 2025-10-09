// src/pages/ManageUsersPage.jsx
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

// Get the columns from your data_table for the permissions checklist
const DATA_COLUMNS = [
  "green_box_weight",
  "press_box",
  "before_flow",
  "kiln_entry_box",
  "packing_box",
  "fired_loss_box",
  "spray_dryer_production",
  "coal_units_use",
  "gas_consumption",
  "pre_box",
  "std_box",
  "eco_box",
  "base",
  "brown",
  "black",
  "blue",
  "red",
  "yellow",
  "green",
  "maintenance",
  "legal_illegal",
  "office",
  "diesel",
  "general_freight",
  "kiln_gap",
  "commutative_kiln_gap",
  "daily_unsizing_stock",
  "body_cost",
  "sizing_fire_loss_boxes",
];

export default function ManageUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for the invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [department, setDepartment] = useState("Production");
  const [permissions, setPermissions] = useState({ read: [], write: [] });
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      // We can query the 'profiles' table directly thanks to RLS
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, full_name, role, department")
        .neq("id", user.id); // Exclude the admin themselves

      if (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      } else {
        setUsers(profiles || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [user.id]);

  const handlePermissionChange = (column, type, checked) => {
    setPermissions((prev) => {
      const current = new Set(prev[type]);
      if (checked) {
        current.add(column);
      } else {
        current.delete(column);
      }
      return { ...prev, [type]: Array.from(current) };
    });
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: "", text: "" });

    try {
      const { error } = await supabase.functions.invoke("invite-user", {
        body: {
          invitee_email: inviteEmail,
          full_name: fullName,
          department,
          permissions: { data_table: permissions },
        },
      });

      if (error) throw error;

      setFormMessage({
        type: "success",
        text: "Invitation sent successfully!",
      });
      // Reset form
      setInviteEmail("");
      setFullName("");
      setPermissions({ read: [], write: [] });
    } catch (error) {
      setFormMessage({
        type: "error",
        text: `Failed to send invite: ${error.message}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Invite User Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Invite New User
        </h1>
        <form
          onSubmit={handleInvite}
          className="bg-white p-8 rounded-xl shadow-md space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="email"
              placeholder="Email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Production</option>
              <option>Packing</option>
              <option>Ink</option>
              <option>Fixed</option>
            </select>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Column Permissions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4 max-h-64 overflow-y-auto p-4 border rounded-md">
              {DATA_COLUMNS.map((col) => (
                <div key={col}>
                  <span className="font-medium text-sm text-gray-700">
                    {col.replace(/_/g, " ")}
                  </span>
                  <div className="flex gap-4 mt-1">
                    <label className="flex items-center text-xs gap-1">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handlePermissionChange(col, "read", e.target.checked)
                        }
                        checked={permissions.read.includes(col)}
                      />{" "}
                      Read
                    </label>
                    <label className="flex items-center text-xs gap-1">
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          handlePermissionChange(col, "write", e.target.checked)
                        }
                        checked={permissions.write.includes(col)}
                      />{" "}
                      Write
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-end items-center gap-4">
            {formMessage.text && (
              <p
                className={`text-sm ${
                  formMessage.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formMessage.text}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </form>
      </div>

      {/* Existing Users Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Manage Existing Users
        </h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <p className="p-4">Loading users...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {u.full_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {u.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {u.department}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
