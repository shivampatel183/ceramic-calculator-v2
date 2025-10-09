// src/pages/DataEntryPage.jsx
import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

// Define which fields belong to which department
const departmentFields = {
  Production: [
    "green_box_weight",
    "press_box",
    "before_flow",
    "kiln_entry_box",
    "fired_loss_box",
    "sizing_fire_loss_boxes",
    "spray_dryer_production",
    "coal_units_use",
    "gas_consumption",
  ],
  Packing: ["packing_box", "pre_box", "std_box", "eco_box"],
  Ink: ["base", "brown", "black", "blue", "red", "yellow", "green"],
  Fixed: [
    "maintenance",
    "legal_illegal",
    "office",
    "diesel",
    "general_freight",
    "kiln_gap",
    "commutative_kiln_gap",
    "daily_unsizing_stock",
    "body_cost",
  ],
};

const allFields = {
  "Core Details": ["date", "size"],
  ...departmentFields,
};

const fieldLabels = {
  date: "Date",
  size: "Size",
  green_box_weight: "Green Box Weight",
  press_box: "Press Box",
  before_flow: "Before Flow",
  kiln_entry_box: "Kiln Entry Box",
  packing_box: "Packing Box",
  fired_loss_box: "Fired Loss Box",
  sizing_fire_loss_boxes: "Sizing Fire Loss Boxes",
  spray_dryer_production: "Spray Dryer Production",
  coal_units_use: "Coal Units Use",
  gas_consumption: "Gas Consumption",
  pre_box: "Pre Box",
  std_box: "Std Box",
  eco_box: "Eco Box",
  base: "Base",
  brown: "Brown",
  black: "Black",
  blue: "Blue",
  red: "Red",
  yellow: "Yellow",
  green: "Green",
  maintenance: "Maintenance",
  legal_illegal: "Legal/Illegal",
  office: "Office",
  diesel: "Diesel",
  general_freight: "General Freight",
  kiln_gap: "Kiln Gap",
  commutative_kiln_gap: "Commutative Kiln Gap",
  daily_unsizing_stock: "Daily Unsizing Stock",
  body_cost: "Body Cost",
};

export default function DataEntryPage() {
  const auth = useAuth();
  if (!auth) {
    // Auth context not ready or provider not available yet — show a loader to avoid a crash
    return (
      <div className="flex h-screen items-center justify-center">
        Loading authentication...
      </div>
    );
  }
  const { user } = auth;
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    size: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Determine which sections to show based on user role or department
  const sectionsToShow =
    user?.role === "admin"
      ? Object.keys(allFields)
      : ["Core Details", user?.department].filter(Boolean);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    // Create a copy of the form data to process
    const submissionData = { ...formData };
    // Convert empty strings to null for database compatibility
    for (const key in submissionData) {
      if (submissionData[key] === "") {
        submissionData[key] = null;
      }
    }

    // Call the RPC function to insert/update the data
    const { error } = await supabase.rpc("insert_daily_data", {
      entry_data: submissionData,
    });

    if (error) {
      setError(`Error: ${error.message}`);
    } else {
      setMessage("Data submitted successfully!");
      // Reset form, keeping the date
      setFormData({
        date: formData.date,
        size: "",
      });
      setTimeout(() => setMessage(""), 3000);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Data Entry</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md space-y-8"
      >
        {sectionsToShow.map((sectionName) => (
          <div key={sectionName}>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-6">
              {sectionName}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(allFields[sectionName] || []).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-600">
                    {fieldLabels[field] || field}
                  </label>
                  <input
                    type={field === "date" ? "date" : "text"}
                    name={field}
                    value={formData[field] || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      typeof allFields[sectionName][0] === "number"
                        ? "0.00"
                        : ""
                    }
                    required={field === "date" || field === "size"}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="pt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Data"}
          </button>
        </div>
        {message && (
          <p className="mt-4 text-center text-sm text-green-600">{message}</p>
        )}
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
      </form>
    </div>
  );
}
