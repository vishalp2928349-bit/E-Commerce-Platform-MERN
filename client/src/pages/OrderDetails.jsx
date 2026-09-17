import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchOrderById } from "../services/orderService.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  // Bug #11 fix: track error state instead of silently swallowing it
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    fetchOrderById(id)
      .then(setOrder)
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to load order. Please try again.");
      });
  }, [id]);

  // Bug #11 fix: show a proper error message instead of an infinite spinner
  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!order) return <LoadingSpinner full />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-2">Order #{order._id.slice(-8)}</h1>
      <p className="text-sm text-gray-500 mb-6">
        Placed on {new Date(order.createdAt).toLocaleDateString()} · Status: <span className="font-medium">{order.orderStatus}</span>
      </p>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-medium mb-3">Items</h3>
        <div className="space-y-3">
          {order.products.map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <img src={item.image || "https://placehold.co/50x50"} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-medium">{item.title}</p>
                <p className="text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="font-medium mb-3">Shipping Address</h3>
        <p className="text-sm text-gray-600">
          {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
          {order.shippingAddress.zipCode}, {order.shippingAddress.country}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-2 text-sm">
        <div className="flex justify-between"><span>Items Total</span><span>${order.itemsPrice.toFixed(2)}</span></div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-green-600"><span>Discount</span><span>-${order.discountAmount.toFixed(2)}</span></div>
        )}
        <div className="flex justify-between font-semibold text-base border-t pt-2"><span>Total</span><span>${order.totalAmount.toFixed(2)}</span></div>
      </div>
    </div>
  );
}
