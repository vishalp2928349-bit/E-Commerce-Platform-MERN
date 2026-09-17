import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { registerUser } from "../redux/slices/authSlice.js";
import { FiShoppingBag, FiPackage } from "react-icons/fi";

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [role, setRole] = useState("customer");

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "seller") navigate("/seller");
      else navigate("/dashboard");
    }
  }, [user, navigate]);

  const onSubmit = (data) => dispatch(registerUser({ ...data, role }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">MERN Shop</h1>
          <p className="text-slate-400 mt-1 text-sm">Create your account</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-slate-800 rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              role === "customer"
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FiShoppingBag size={16} /> Buyer
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              role === "seller"
                ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FiPackage size={16} /> Seller
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 space-y-5"
        >
          <div>
            <input
              {...register("name", { required: "Name is required" })}
              placeholder="Full Name"
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              placeholder="Email address"
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register("password", { required: "Password is required", minLength: { value: 6, message: "Min 6 characters" } })}
              type="password"
              placeholder="Password"
              className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 ${
              role === "seller"
                ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            }`}
          >
            {loading ? "Creating account..." : `Register as ${role === "seller" ? "Seller" : "Buyer"}`}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 font-medium hover:text-purple-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
