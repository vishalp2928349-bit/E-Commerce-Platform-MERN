import { useEffect, useState } from "react";
import { fetchSellerProducts } from "../../services/sellerService.js";
import { deleteProduct } from "../../services/productService.js";
import Modal from "../../components/Modal.jsx";
import ProductForm from "../../components/admin/ProductForm.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2, FiPackage } from "react-icons/fi";

export default function SellerMyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = () => {
    setLoading(true);
    fetchSellerProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Product deleted");
      load();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Products</h1>
          <p className="text-slate-400 text-sm mt-1">{products.length} product{products.length !== 1 ? "s" : ""} listed</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-orange-900/30"
        >
          <FiPlus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : products.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiPackage size={28} className="text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">No products yet</p>
          <p className="text-slate-500 text-sm mt-1">Click "Add Product" to list your first item</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Stock</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((p) => (
                <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images?.[0]?.url || "https://placehold.co/40x40/1e293b/94a3b8?text=No+Img"}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                        alt={p.title}
                      />
                      <span className="text-white font-medium truncate max-w-[180px]">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{p.category?.name || "—"}</td>
                  <td className="px-6 py-4 text-emerald-400 font-semibold">${p.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setEditing(p); setModalOpen(true); }}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-all"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Product" : "Add Product"}>
        <ProductForm product={editing} onSaved={() => { setModalOpen(false); load(); }} />
      </Modal>
    </div>
  );
}
