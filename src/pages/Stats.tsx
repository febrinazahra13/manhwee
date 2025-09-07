import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, BarChart2, User, LogOut } from "lucide-react";
import type { Manhwa } from "../types";

const COLORS = ["#34d399", "#60a5fa", "#fbbf24", "#f87171"];

export default function Stats() {
  const [completedData, setCompletedData] = useState<any[]>([]);
  const [statusCounts, setStatusCounts] = useState<any>({});
  const [genres, setGenres] = useState<any>({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("manhwee:data") || "[]") as Manhwa[];

    // Completed per Month
    const monthly: Record<string, number> = {};
    stored.forEach((item) => {
      if (item.status === "Completed") {
        const date = new Date(parseInt(item.id));
        const month = date.toLocaleString("default", { month: "short" });
        monthly[month] = (monthly[month] || 0) + 1;
      }
    });
    const monthlyData = Object.entries(monthly).map(([month, completed]) => ({
      month,
      completed,
    }));

    // Status Counts
    const status: Record<string, number> = {
      Completed: 0,
      Reading: 0,
      "Not Started": 0,
      Dropped: 0,
    };
    stored.forEach((item) => {
      if (status[item.status] !== undefined) status[item.status]++;
    });

    // Genre Counts
    const genreMap: Record<string, number> = {};
    stored.forEach((item) => {
      item.genres?.forEach((g) => {
        genreMap[g] = (genreMap[g] || 0) + 1;
      });
    });

    setCompletedData(monthlyData);
    setStatusCounts(status);
    setGenres(genreMap);
  }, []);

  const pieData = [
    { name: "Completed", value: statusCounts["Completed"] || 0 },
    { name: "Reading", value: statusCounts["Reading"] || 0 },
    { name: "Not Started", value: statusCounts["Not Started"] || 0 },
    { name: "Dropped", value: statusCounts["Dropped"] || 0 },
  ];

  // Achievements
  const achievements = [];
  if ((statusCounts["Completed"] || 0) >= 10) achievements.push("🏆 10 Manhwa Completed!");
  if ((statusCounts["Reading"] || 0) >= 5) achievements.push("📖 Consistent Reader: 5+ ongoing manhwa");
  if ((statusCounts["Dropped"] || 0) === 0 && Object.keys(statusCounts).length > 0)
    achievements.push("💯 No Drops Yet!");

  // Genre Insight
  const sortedGenres = Object.entries(genres).sort((a, b) => b[1] - a[1]);
  const favoriteGenre = sortedGenres[0];
  const secondGenre = sortedGenres[1];
  const genreInsight = favoriteGenre
    ? `You enjoy ${favoriteGenre[0]} ${Math.round(
        (favoriteGenre[1] / (secondGenre ? secondGenre[1] || 1 : 1)) * 100
      )}% more than ${secondGenre ? secondGenre[0] : "other genres"}.`
    : "Start reading to discover your favorite genre!";

  // Navbar Styles
  const NAV_STYLES: Record<string, { base: string; active: string }> = {
    "/app": {
      base: "bg-purple-500 text-white hover:bg-purple-600",
      active: "bg-purple-700 text-white font-bold ring-2 ring-purple-900",
    },
    "/stats": {
      base: "bg-green-500 text-white hover:bg-green-600",
      active: "bg-green-700 text-white font-bold ring-2 ring-green-900",
    },
    "/profile": {
      base: "bg-yellow-500 text-white hover:bg-yellow-600",
      active: "bg-yellow-700 text-white font-bold ring-2 ring-yellow-900",
    },
    logout: {
      base: "bg-red-600 text-white hover:bg-red-700",
      active: "bg-red-700 text-white font-bold ring-2 ring-red-900",
    },
  };

  const handleLogout = () => {
    localStorage.removeItem("manhwee:token");
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <h1 className="text-lg font-bold text-purple-600">📊 Statistics</h1>
        <div className="flex items-center gap-3 text-sm font-medium">
          {/* Dashboard */}
          <button
            onClick={() => navigate("/app")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md shadow transition ${
              location.pathname === "/app" ? NAV_STYLES["/app"].active : NAV_STYLES["/app"].base
            }`}
          >
            <Home size={16} /> Dashboard
          </button>

          {/* Statistic */}
          <button
            onClick={() => navigate("/stats")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md shadow transition ${
              location.pathname === "/stats" ? NAV_STYLES["/stats"].active : NAV_STYLES["/stats"].base
            }`}
          >
            <BarChart2 size={16} /> Statistic
          </button>

          {/* Profile */}
          <button
            onClick={() => navigate("/profile")}
            className={`flex items-center gap-1 px-3 py-1 rounded-md shadow transition ${
              location.pathname === "/profile" ? NAV_STYLES["/profile"].active : NAV_STYLES["/profile"].base
            }`}
          >
            <User size={16} /> Profile
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-1 px-3 py-1 rounded-md shadow transition ${NAV_STYLES.logout.base}`}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <section className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Line Chart */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Manhwa Completed Per Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={completedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="completed" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow p-10">
          <h2 className="text-lg font-semibold mb-4">Reading Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                dataKey="value"
                labelLine={false}
                label={({ cx, cy, midAngle, outerRadius, percent, name, value }) => {
                  if (value === 0) return null;
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 20;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);

                  return (
                    <text
                      x={x}
                      y={y}
                      fill="#333"
                      textAnchor={x > cx ? "start" : "end"}
                      dominantBaseline="central"
                      style={{ fontSize: "12px" }}
                    >
                      {`${name}: ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.value === 0 ? "#00000000" : COLORS[index % COLORS.length]}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={entry.value === 0 ? 1 : 0}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: any, name: any) => [`${value}`, name]} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">🏅 Achievements</h2>
          {achievements.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {achievements.map((a, idx) => (
                <li key={idx}>{a}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No achievements yet. Keep reading!</p>
          )}
        </div>

        {/* Genre Insight */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">🔍 Insights</h2>
          <p className="text-gray-700">{genreInsight}</p>
        </div>
      </section>
    </main>
  );
}