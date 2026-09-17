import { useEffect, useState } from "react";
import { fetchSellerOrders } from "../../services/sellerService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { FiShoppingBag } from "react-icons/fi";

const statusColors = {
  processing: "bg-yellow-500/20 text-yellow-400",
  shipped: "bg-blue-500/20 text-blue-400",
  delivered: "bg-green-500/20 text-green-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function SellerMyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellerOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Orders</h1>
        <p className="text-slate-400 text-sm mt-1">Orders containing your products</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiShoppingBag size={28} className="text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No orders yet</p>
          <p className="text-slate-500 text-sm mt-1">Orders will appear here when customers purchase your products</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="text-left px-6 py-4">Order ID</th>
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Items</th>
                <th className="text-left px-6 py-4">Total</th>
                <th className="text-left px-6 py-4">Payment</th>
                <th className="text-left px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {orders.map((o) => (
                <tr key={o._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4 text-slate-300 font-mono text-xs">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{o.user?.name || "—"}</p>
                    <p className="text-slate-500 text-xs">{o.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-slate-300">{o.products?.length ?? 0} item(s)</td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">${o.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      o.paymentStatus === "paid" ? "bg-emerald-500/20 text-emerald-400" :
                      o.paymentStatus === "failed" ? "bg-red-500/20 text-red-400" :
                      "bg-slate-700 text-slate-400"
                    }`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[o.orderStatus] || "bg-slate-700 text-slate-400"}`}>
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
  );
}
