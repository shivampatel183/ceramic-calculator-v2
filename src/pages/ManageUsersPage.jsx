import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function CreateUserForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFields, setSelectedFields] = useState([]);
  const [loading, setLoading] = useState(false);

  // Example list of fields available in data_table
  const availableFields = [
    "item_name",
    "quantity",
    "price",
    "supplier",
    "date",
  ];

  const toggleField = (field) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create auth user
      const { data: userData, error: signupError } =
        await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

      if (signupError) throw signupError;

      const userId = userData.user.id;

      // 2️⃣ Build permission JSON (same fields for read/write)
      const permissions = {
        data_table: {
          read: selectedFields,
          write: selectedFields,
        },
      };

      // 3️⃣ Insert into profiles
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: userId,
          full_name: fullName,
          role: "user",
          permissions,
        },
      ]);

      if (profileError) throw profileError;

      alert("✅ User created successfully!");
      setFullName("");
      setEmail("");
      setPassword("");
      setSelectedFields([]);
    } catch (err) {
      console.error(err);
      alert("Error creating user: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleCreateUser}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
    >
      <h2 className="text-lg font-semibold mb-2">Create New User</h2>

      <div>
        <label className="block text-sm font-medium">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Select Allowed Fields
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableFields.map((field) => (
            <label
              key={field}
              className="flex items-center space-x-2 border p-2 rounded"
            >
              
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
