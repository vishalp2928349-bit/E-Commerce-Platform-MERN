import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchOrders, updateOrderStatus } from "../../services/orderService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

const statuses = ["processing", "shipped", "delivered", "cancelled"];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetchOrders().then(setOrders).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success("Order status updated");
      load();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Orders</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-t">
                <td className="p-3">#{o._id.slice(-8)}</td>
                <td className="p-3">{o.user?.name}</td>
                <td className="p-3">${o.totalAmount.toFixed(2)}</td>
                <td className="p-3">
                  <select
                    value={o.orderStatus}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
                    className="border rounded-lg px-2 py-1 text-xs"
                  >
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
