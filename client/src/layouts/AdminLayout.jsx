import { Outlet, Link, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";
import {
  FiGrid, FiBox, FiList, FiUsers, FiShoppingBag, FiTag,
  FiLogOut, FiZap
} from "react-icons/fi";

const links = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/categories", label: "Categories", icon: FiList },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/coupons", label: "Coupons", icon: FiTag },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="min-h-screen flex bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg flex items-center justify-center">
              <FiZap size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-900/40"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`
              }
            >
              <Icon size={17} /> {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition-all"
          >
            <FiLogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center px-6 justify-between">
          <p className="text-slate-300 text-sm">
            Welcome back, <span className="text-white font-semibold">{user?.name}</span>
          </p>
          <Link to="/" className="text-sm text-slate-400 hover:text-violet-400 transition-colors">
            ← Back to Store
          </Link>
        </header>
        <main className="flex-1 p-6 bg-slate-950 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
