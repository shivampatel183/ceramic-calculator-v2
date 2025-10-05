// src/pages/HomePage.jsx
import { useAuth } from "../context/AuthContext";
import { BarChart, LineChart } from "lucide-react"; // Placeholder icons

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome, {user?.ceramic_name || "Admin"}!
      </h1>
      <p className="text-gray-500 mb-8">
        Here's a summary of your factory's performance.
      </p>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Production (MTD)
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">1,234.56</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Average Cost/Sq.Ft
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">$2.78</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Energy Consumption
          </h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">5,432 kWh</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Overall Efficiency
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">92.5%</p>
        </div>
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow h-96 flex flex-col items-center justify-center">
          <LineChart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700">Production Cost Over Time</h3>
          <p className="text-sm text-gray-500">Chart will be displayed here.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow h-96 flex flex-col items-center justify-center">
          <BarChart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700">Cost Breakdown by Type</h3>
          <p className="text-sm text-gray-500">Chart will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}
