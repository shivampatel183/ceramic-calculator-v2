// src/pages/home.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import {
  BarChart,
  LineChart,
  TrendingUp,
  DollarSign,
  Zap,
  Target,
} from "lucide-react";

// Helper component for individual KPI cards
const KpiCard = ({ title, value, icon, unit, loading }) => {
  const IconComponent = icon;
  return (
    <div className="bg-white p-6 rounded-xl shadow-md transition hover:shadow-lg hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <IconComponent className="w-6 h-6 text-blue-500" />
      </div>
      {loading ? (
        <div className="mt-2 h-9 w-32 bg-gray-200 animate-pulse rounded-md"></div>
      ) : (
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {value}
          {unit && (
            <span className="text-base font-medium text-gray-500 ml-1">
              {unit}
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export default function Homepage() {
  const [profile, setProfile] = useState(null);
  const [kpis, setKpis] = useState({
    production: 0,
    cost: 0,
    energy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // 1. Get current user session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // 2. Fetch the user's profile to get their company name
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("full_name") // Use full_name which we set to company name on signup
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
        } else {
          setProfile(profileData);
        }
      }

      // 3. Fetch the factory data using the RPC function
      const { data: factoryData, error: rpcError } = await supabase.rpc(
        "get_data_for_my_factory"
      );

      if (rpcError) {
        console.error("Failed to fetch dashboard data:", rpcError);
      } else if (factoryData) {
        // Calculate your KPIs from the returned data
        const totalProduction = factoryData.reduce(
          (sum, row) => sum + (row.packing_box || 0),
          0
        );
        const totalBodyCost = factoryData.reduce(
          (sum, row) => sum + (row.body_cost || 0),
          0
        );
        const totalEnergy = factoryData.reduce(
          (sum, row) =>
            sum + (row.gas_consumption || 0) + (row.coal_units_use || 0),
          0
        );
        const avgCost = factoryData.length
          ? totalBodyCost / factoryData.length
          : 0;

        setKpis({
          production: totalProduction,
          cost: avgCost,
          energy: totalEnergy,
        });
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {loading ? "..." : profile?.full_name || "Admin"}!
        </h1>
        <p className="text-gray-500 mt-2">
          Here's a performance overview of your factory.
        </p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KpiCard
          title="Total Production"
          value={kpis.production.toLocaleString()}
          unit="Boxes"
          icon={TrendingUp}
          loading={loading}
        />
        <KpiCard
          title="Avg. Body Cost / Day"
          value={kpis.cost.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
          icon={DollarSign}
          loading={loading}
        />
        <KpiCard
          title="Energy Consumption"
          value={kpis.energy.toLocaleString()}
          unit="Units"
          icon={Zap}
          loading={loading}
        />
        <KpiCard
          title="Overall Efficiency"
          value="92.5"
          unit="%"
          icon={Target}
          loading={loading}
        />
      </div>

      {/* Chart Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md h-96 flex flex-col items-center justify-center text-center">
          <LineChart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700">Production Cost Over Time</h3>
          <p className="text-sm text-gray-500 mt-1">
            This chart will visualize your daily costs.
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md h-96 flex flex-col items-center justify-center text-center">
          <BarChart className="w-16 h-16 text-gray-300 mb-4" />
          <h3 className="font-bold text-gray-700">Cost Breakdown by Type</h3>
          <p className="text-sm text-gray-500 mt-1">
            This chart will show a pie or bar chart of cost categories.
          </p>
        </div>
      </div>
    </div>
  );
}
