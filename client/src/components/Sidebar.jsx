import { NavLink } from "react-router-dom";
import { FiGrid, FiBox, FiList, FiUsers, FiShoppingBag, FiTag } from "react-icons/fi";

const links = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, end: true },
  { to: "/admin/products", label: "Products", icon: FiBox },
  { to: "/admin/categories", label: "Categories", icon: FiList },
  { to: "/admin/orders", label: "Orders", icon: FiShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: FiUsers },
  { to: "/admin/coupons", label: "Coupons", icon: FiTag },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 bg-white border-r min-h-[calc(100vh-4rem)] py-6 hidden md:block">
      <nav className="flex flex-col gap-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
