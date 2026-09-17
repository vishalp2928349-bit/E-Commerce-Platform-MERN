import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchCategories, createCategory, deleteCategory } from "../../services/categoryService.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  const load = () => {
    setLoading(true);
    fetchCategories().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await createCategory({ name });
      toast.success("Category added");
      setName("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    toast.success("Category deleted");
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6 max-w-md">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name"
          className="flex-1 border rounded-lg px-3 py-2 text-sm" />
        <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium">Add</button>
      </form>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow-sm divide-y">
          {categories.map((c) => (
            <div key={c._id} className="flex justify-between items-center p-3 text-sm">
              {c.name}
              <button onClick={() => handleDelete(c._id)} className="text-red-500">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
