import { Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import SellerLayout from "./layouts/SellerLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import SellerRoute from "./components/SellerRoute.jsx";

import Home from "./pages/Home.jsx";
import Shop from "./pages/Shop.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import OrderHistory from "./pages/OrderHistory.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import NotFound from "./pages/NotFound.jsx";

// Admin
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import ManageProducts from "./pages/admin/ManageProducts.jsx";
import ManageCategories from "./pages/admin/ManageCategories.jsx";
import ManageOrders from "./pages/admin/ManageOrders.jsx";
import ManageCustomers from "./pages/admin/ManageCustomers.jsx";
import ManageCoupons from "./pages/admin/ManageCoupons.jsx";

// Seller
import SellerDashboard from "./pages/seller/Dashboard.jsx";
import SellerMyProducts from "./pages/seller/MyProducts.jsx";
import SellerMyOrders from "./pages/seller/MyOrders.jsx";

// Buyer
import BuyerDashboard from "./pages/buyer/Dashboard.jsx";

export default function App() {
  return (
    <Routes>
      {/* ── Public / Storefront ── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
      </Route>

      {/* ── Buyer Dashboard ── */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>}
      />

      {/* ── Admin Dashboard ── */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ManageProducts />} />
        <Route path="categories" element={<ManageCategories />} />
        <Route path="orders" element={<ManageOrders />} />
        <Route path="customers" element={<ManageCustomers />} />
        <Route path="coupons" element={<ManageCoupons />} />
      </Route>

      {/* ── Seller Dashboard ── */}
      <Route path="/seller" element={<SellerRoute><SellerLayout /></SellerRoute>}>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerMyProducts />} />
        <Route path="orders" element={<SellerMyOrders />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
