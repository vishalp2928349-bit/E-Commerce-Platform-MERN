import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchBuyerStats } from "../../services/userService.js";
import { fetchOrders } from "../../services/orderService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import {
  FiShoppingBag, FiDollarSign, FiClock, FiHeart,
  FiShoppingCart, FiPackage, FiUser, FiArrowRight
} from "react-icons/fi";

const statusColors = {
  processing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  shipped: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function BuyerDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchBuyerStats(), fetchOrders()])
      .then(([s, orders]) => {
        setStats(s);
        setRecentOrders(orders.slice(0, 4));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );

  const cards = [
    { label: "Total Orders", value: stats?.totalOrders ?? 0, icon: FiShoppingBag, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { label: "Amount Spent", value: `$${stats?.totalSpent?.toFixed(2) || "0.00"}`, icon: FiDollarSign, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Active Orders", value: stats?.activeOrders ?? 0, icon: FiClock, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    { label: "Wishlist Items", value: stats?.wishlistItems ?? 0, icon: FiHeart, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
  ];

  const quickActions = [
    { label: "Browse Shop", desc: "Discover new products", to: "/shop", icon: FiShoppingCart, color: "from-blue-500 to-purple-600" },
    { label: "My Orders", desc: "Track your purchases", to: "/orders", icon: FiPackage, color: "from-emerald-500 to-teal-600" },
    { label: "Wishlist", desc: "Saved for later", to: "/wishlist", icon: FiHeart, color: "from-rose-500 to-pink-600" },
    { label: "My Profile", desc: "Manage your info", to: "/profile", icon: FiUser, color: "from-orange-500 to-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      {/* Top nav */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold text-slate-900">MERN Shop</Link>
          <div className="flex items-center gap-3">
            <Link to="/shop" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Shop</Link>
            <Link to="/orders" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Orders</Link>
            <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              {user?.name?.[0]?.toUpperCase()}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white transform translate-x-24 -translate-y-24" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white transform -translate-x-12 translate-y-12" />
          </div>
          <div className="relative">
            <p className="text-blue-100 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-3xl font-bold mb-2">{user?.name}</h1>
            <p className="text-blue-100 text-sm">{user?.email}</p>
            <Link
              to="/shop"
              className="mt-5 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-all"
            >
              Continue Shopping <FiArrowRight size={15} />
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Your Overview</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div
                key={c.label}
                className={`bg-white border ${c.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                  <c.icon size={18} className={c.color} />
                </div>
                <p className="text-slate-500 text-xs font-medium">{c.label}</p>
                <p className={`text-2xl font-bold mt-1 ${c.color}`}>{c.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((a) => (
              <Link
                key={a.to}
                to={a.to}
                className="group bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  <a.icon size={18} className="text-white" />
                </div>
                <p className="text-slate-800 font-semibold text-sm">{a.label}</p>
                <p className="text-slate-400 text-xs mt-0.5">{a.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
            <Link to="/orders" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View all <FiArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-600 font-medium">No orders yet</p>
              <p className="text-slate-400 text-sm mt-1 mb-4">Start shopping to see your orders here</p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
              >
                Browse Products <FiArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="text-left px-6 py-3">Order</th>
                    <th className="text-left px-6 py-3">Items</th>
                    <th className="text-left px-6 py-3">Total</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((o) => (
                    <tr key={o._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <Link to={`/orders/${o._id}`} className="text-blue-600 font-mono text-xs hover:text-blue-800">
                          #{o._id.slice(-8).toUpperCase()}
                        </Link>
                        <p className="text-slate-400 text-xs mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{o.products?.length ?? 0} item(s)</td>
                      <td className="px-6 py-4 text-emerald-600 font-semibold">${o.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[o.orderStatus] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
