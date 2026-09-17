import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiTrash2 } from "react-icons/fi";
import { fetchCart, updateCartItem, removeCartItem, applyCoupon } from "../redux/slices/cartSlice.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: cart, loading } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading && cart.products.length === 0) return <LoadingSpinner full />;

  const items = cart?.products || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cart?.coupon?.discount ? (subtotal * cart.coupon.discount) / 100 : 0;
  const total = subtotal - discount;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <Link to="/shop" className="text-primary font-medium">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product._id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
              <img
                src={item.product.images?.[0]?.url || "https://placehold.co/80x80"}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="font-medium text-sm">{item.product.title}</h3>
                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                <div className="flex items-center border rounded-full w-fit mt-2">
                  <button
                    onClick={() => dispatch(updateCartItem({ productId: item.product._id, quantity: item.quantity - 1 }))}
                    className="px-3 py-1"
                  >
                    -
                  </button>
                  <span className="px-3">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateCartItem({ productId: item.product._id, quantity: item.quantity + 1 }))}
                    className="px-3 py-1"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                <button
                  onClick={() => dispatch(removeCartItem(item.product._id))}
                  className="text-gray-400 hover:text-red-500 mt-2"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm h-fit">
          <h3 className="font-semibold mb-4">Order Summary</h3>
          <div className="flex gap-2 mb-4">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => dispatch(applyCoupon(couponCode))}
              className="bg-gray-800 text-white px-4 rounded-lg text-sm"
            >
              Apply
            </button>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount ({cart.coupon.code})</span><span>-${discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
              <span>Total</span><span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-primary text-white py-3 rounded-full font-medium mt-6 hover:bg-primary-dark"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
