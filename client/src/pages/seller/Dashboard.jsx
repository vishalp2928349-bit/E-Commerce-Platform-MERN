import { useEffect, useState } from "react";
import { fetchSellerStats, fetchSellerOrders } from "../../services/sellerService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { FiBox, FiDollarSign, FiShoppingBag, FiClock, FiTrendingUp } from "react-icons/fi";

const statusColors = {
  processing: "bg-yellow-500/20 text-yellow-400",
  shipped: "bg-blue-500/20 text-blue-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchSellerStats(), fetchSellerOrders()])
      .then(([s, orders]) => {
        setStats(s);
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    {
      label: "My Products",
      value: stats?.totalProducts ?? 0,
      icon: FiBox,
      gradient: "from-orange-500 to-pink-600",
      glow: "shadow-orange-900/40",
    },
    {
      label: "My Revenue",
      value: `$${stats?.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: FiDollarSign,
      gradient: "from-emerald-500 to-teal-600",
      glow: "shadow-emerald-900/40",
    },
    {
      label: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: FiShoppingBag,
      gradient: "from-blue-500 to-cyan-600",
      glow: "shadow-blue-900/40",
    },
    {
      label: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: FiClock,
      gradient: "from-yellow-500 to-orange-500",
      glow: "shadow-yellow-900/40",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Your store performance</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">
          <FiTrendingUp size={14} className="text-orange-400" />
          <span className="text-sm text-slate-300">Live stats</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden group hover:border-slate-700 transition-all duration-200"
          >
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br ${c.gradient} opacity-15 group-hover:opacity-25 transition-opacity`} />
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg ${c.glow} mb-4`}>
              <c.icon size={18} className="text-white" />
            </div>
            <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{c.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-base font-semibold text-white">Recent Orders</h2>
          <a href="/seller/orders" className="text-xs text-orange-400 hover:text-orange-300">View all →</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider">
                <th className="text-left px-6 py-3">Order ID</th>
                <th className="text-left px-6 py-3">Customer</th>
                <th className="text-left px-6 py-3">Amount</th>
                <th className="text-left px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No orders yet. Start by listing your products!
                  </td>
                </tr>
              ) : (
                recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-slate-300 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-white">{o.user?.name || "—"}</td>
                    <td className="px-6 py-4 text-emerald-400 font-semibold">${o.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[o.orderStatus] || "bg-slate-700 text-slate-400"}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
