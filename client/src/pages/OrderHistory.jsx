import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const statusColors = {
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderHistory() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <LoadingSpinner full />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Order History</h1>
      {items.length === 0 ? (
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {items.map((order) => (
            <Link
              to={`/orders/${order._id}`}
              key={order._id}
              className="block bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Order #{order._id.slice(-8)}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full ${statusColors[order.orderStatus]}`}>
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">{order.products.length} item(s) · ${order.totalAmount.toFixed(2)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
