import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchCoupons, createCoupon } from "../../services/couponService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

export default function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: "", discount: "", expiryDate: "" });

  const load = () => {
    setLoading(true);
    fetchCoupons().then(setCoupons).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await createCoupon(form);
      toast.success("Coupon created");
      setForm({ code: "", discount: "", expiryDate: "" });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create coupon");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Coupons</h1>
      <form onSubmit={handleAdd} className="flex flex-wrap gap-2 mb-6">
        <input required placeholder="Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm" />
        <input required type="number" placeholder="Discount %" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm w-32" />
        <input required type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          className="border rounded-lg px-3 py-2 text-sm" />
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Add Coupon</button>
      </form>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {coupons.map((c) => (
            <div key={c._id} className="flex justify-between items-center p-3 text-sm">
              <span className="font-medium">{c.code}</span>
              <span>{c.discount}% off</span>
              <span className="text-gray-500">Expires {new Date(c.expiryDate).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
