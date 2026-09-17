import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiShoppingCart, FiHeart, FiUser, FiLogOut, FiSearch, FiGrid } from "react-icons/fi";
import { useState } from "react";
import { logout } from "../redux/slices/authSlice.js";

function getDashboardLink(role) {
  if (role === "admin") return "/admin";
  if (role === "seller") return "/seller";
  return "/dashboard";
}

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const { data: cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const cartCount = cart?.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/shop?keyword=${encodeURIComponent(keyword)}` : "/shop");
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-primary shrink-0">
          MERN Shop
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              type="text"
              placeholder="Search products..."
              className="w-full border border-gray-200 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FiSearch />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-4">
          <Link to="/wishlist" className="relative text-gray-600 hover:text-primary">
            <FiHeart size={20} />
          </Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-primary">
            <FiShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to={getDashboardLink(user.role)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-primary"
                title="My Dashboard"
              >
                <FiGrid size={18} />
                <span className="hidden md:inline">
                  {user.role === "admin" ? "Admin" : user.role === "seller" ? "Seller" : "Dashboard"}
                </span>
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-primary">
                <FiUser size={20} />
              </Link>
              <button
                onClick={() => dispatch(logout())}
                className="text-gray-600 hover:text-red-500"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
