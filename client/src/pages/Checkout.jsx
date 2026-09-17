import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createOrder } from "../redux/slices/orderSlice.js";
import { fetchCart } from "../redux/slices/cartSlice.js";
import { payOrder } from "../services/orderService.js";
import {
  FiCreditCard, FiTruck, FiCheck, FiLock,
  FiShoppingBag, FiMapPin, FiChevronRight
} from "react-icons/fi";

const DUMMY_CARDS = [
  { label: "Visa", number: "**** **** **** 4242", expiry: "12/26", color: "from-blue-600 to-blue-800" },
  { label: "Mastercard", number: "**** **** **** 5555", expiry: "09/27", color: "from-red-600 to-orange-600" },
  { label: "Amex", number: "**** **** **** 3782", expiry: "03/28", color: "from-slate-600 to-slate-800" },
];

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1 = address, 2 = payment
  const [submitting, setSubmitting] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" | "cod"
  const [selectedCard, setSelectedCard] = useState(0);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [paySuccess, setPaySuccess] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "",
  });

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const items = cart?.products || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = cart?.coupon?.discount ? (subtotal * cart.coupon.discount) / 100 : 0;
  const total = subtotal - discount;

  // Step 1 — validate address and proceed to payment
  const handleContinue = (e) => {
    e.preventDefault();
    const { street, city, state, zipCode, country } = shippingAddress;
    if (!street || !city || !state || !zipCode || !country) {
      toast.error("Please fill in all address fields");
      return;
    }
    setStep(2);
  };

  // Step 2 — place order then optionally pay immediately
  const handlePlaceAndPay = async () => {
    if (items.length === 0) { toast.error("Your cart is empty"); return; }
    setSubmitting(true);
    try {
      // 1. Create order (paymentStatus = "pending")
      const order = await dispatch(
        createOrder({
          shippingAddress,
          paymentMethod: paymentMethod === "online" ? "Dummy Card" : "Cash on Delivery",
        })
      ).unwrap();

      setPlacedOrderId(order._id);

      if (paymentMethod === "cod") {
        toast.success("Order placed! Pay when it arrives 🚚");
        navigate(`/orders/${order._id}`);
        return;
      }

      // 2. Simulate online payment
      setPaying(true);
      await new Promise((res) => setTimeout(res, 2200)); // fake processing delay

      await payOrder(order._id, DUMMY_CARDS[selectedCard].label);
      setPaySuccess(true);
      toast.success("Payment successful! 🎉");

      setTimeout(() => navigate(`/orders/${order._id}`), 1800);
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setSubmitting(false);
      setPaying(false);
    }
  };

  // ── Payment success screen
  if (paySuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200 animate-bounce mb-6">
          <FiCheck size={36} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
        <p className="text-slate-500 text-sm">Redirecting to your order…</p>
      </div>
    );
  }

  // ── Processing screen
  if (paying) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-200 mb-6 animate-pulse">
          <FiLock size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Processing Payment…</h2>
        <p className="text-slate-500 text-sm mb-6">Please wait, do not close this page</p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-2">
        <FiShoppingBag className="text-primary" /> Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Left: Steps ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-2">
            {[{ n: 1, label: "Shipping" }, { n: 2, label: "Payment" }].map(({ n, label }, i) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= n ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                }`}>
                  {step > n ? <FiCheck size={13} /> : n}
                </div>
                <span className={`text-sm font-medium ${step >= n ? "text-slate-800" : "text-slate-400"}`}>{label}</span>
                {i < 1 && <FiChevronRight size={14} className="text-slate-300 ml-1" />}
              </div>
            ))}
          </div>

          {/* ── Step 1: Shipping Address ── */}
          {step === 1 && (
            <form onSubmit={handleContinue} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <FiMapPin className="text-primary" />
                <h2 className="font-semibold text-slate-800">Shipping Address</h2>
              </div>

              <input
                required
                placeholder="Street address"
                value={shippingAddress.street}
                onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="City" value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input required placeholder="State" value={shippingAddress.state}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="ZIP Code" value={shippingAddress.zipCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input required placeholder="Country" value={shippingAddress.country}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                Continue to Payment <FiChevronRight />
              </button>
            </form>
          )}

          {/* ── Step 2: Payment ── */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">
              <div className="flex items-center gap-2 mb-1">
                <FiCreditCard className="text-primary" />
                <h2 className="font-semibold text-slate-800">Payment Method</h2>
              </div>

              {/* Method Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("online")}
                  className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                    paymentMethod === "online"
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <FiCreditCard size={18} />
                  Pay Online
                  {paymentMethod === "online" && <FiCheck size={14} className="ml-auto" />}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                    paymentMethod === "cod"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <FiTruck size={18} />
                  Cash on Delivery
                  {paymentMethod === "cod" && <FiCheck size={14} className="ml-auto" />}
                </button>
              </div>

              {/* Dummy Card Selector */}
              {paymentMethod === "online" && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Select a test card</p>
                  <div className="space-y-3">
                    {DUMMY_CARDS.map((card, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedCard(i)}
                        className={`w-full text-left transition-all rounded-2xl overflow-hidden border-2 ${
                          selectedCard === i ? "border-primary shadow-md shadow-primary/20" : "border-transparent"
                        }`}
                      >
                        {/* Card visual */}
                        <div className={`bg-gradient-to-r ${card.color} p-5 text-white`}>
                          <div className="flex justify-between items-start mb-4">
                            <span className="text-xs font-semibold tracking-widest opacity-80">{card.label}</span>
                            {selectedCard === i && (
                              <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                <FiCheck size={11} className="text-primary" />
                              </div>
                            )}
                          </div>
                          <p className="font-mono text-sm tracking-widest mb-3">{card.number}</p>
                          <div className="flex justify-between text-xs opacity-75">
                            <span>VALID THRU {card.expiry}</span>
                            <span>{user?.name?.toUpperCase()}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Secure badge */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                    <FiLock size={12} />
                    <span>This is a <strong>dummy payment</strong> — no real card is charged</span>
                  </div>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-sm text-emerald-700 flex items-start gap-3">
                  <FiTruck size={18} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Cash on Delivery selected</p>
                    <p className="text-emerald-600 mt-0.5 text-xs">Pay in cash when your order arrives at your door.</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
                >
                  ← Back
                </button>
                <button
                  onClick={handlePlaceAndPay}
                  disabled={submitting}
                  className={`flex-1 py-3 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === "online"
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-200"
                      : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-200"
                  } disabled:opacity-50`}
                >
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Processing…</>
                  ) : paymentMethod === "online" ? (
                    <><FiLock size={15} /> Pay ${total.toFixed(2)}</>
                  ) : (
                    <><FiTruck size={15} /> Place Order</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <FiShoppingBag size={16} className="text-primary" /> Order Summary
            </h3>

            {/* Items */}
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <img
                    src={item.image || "https://placehold.co/40x40/f1f5f9/94a3b8?text=?"}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0"
                    alt={item.title}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 font-medium truncate">{item.title}</p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-slate-700">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon discount</span>
                  <span>−${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 text-base pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
