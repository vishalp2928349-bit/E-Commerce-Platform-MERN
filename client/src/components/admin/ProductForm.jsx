import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { createProduct, updateProduct, uploadImages } from "../../services/productService.js";
import { fetchCategories } from "../../services/categoryService.js";

export default function ProductForm({ product, onSaved }) {
  const { register, handleSubmit, reset } = useForm({ defaultValues: product || {} });
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
    reset(product || {});
  }, [product, reset]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      let images = product?.images || [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((f) => formData.append("images", f));
        const uploaded = await uploadImages(formData);
        images = [...images, ...uploaded];
      }

      const payload = { ...data, price: Number(data.price), stock: Number(data.stock), discount: Number(data.discount) || 0, images };

      if (product) {
        await updateProduct(product._id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <input {...register("title", { required: true })} placeholder="Title" className="w-full border rounded-lg px-3 py-2 text-sm" />
      <textarea {...register("description", { required: true })} placeholder="Description" rows={3} className="w-full border rounded-lg px-3 py-2 text-sm" />
      <select {...register("category", { required: true })} className="w-full border rounded-lg px-3 py-2 text-sm">
        <option value="">Select Category</option>
        {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
      </select>
      <input {...register("brand")} placeholder="Brand" className="w-full border rounded-lg px-3 py-2 text-sm" />
      <div className="grid grid-cols-3 gap-3">
        <input {...register("price", { required: true })} type="number" step="0.01" placeholder="Price" className="border rounded-lg px-3 py-2 text-sm" />
        <input {...register("discount")} type="number" placeholder="Discount %" className="border rounded-lg px-3 py-2 text-sm" />
        <input {...register("stock", { required: true })} type="number" placeholder="Stock" className="border rounded-lg px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm text-gray-600 block mb-1">Product Images</label>
        <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} className="text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("featured")} /> Featured product
      </label>
      <button type="submit" disabled={saving} className="w-full bg-primary text-white py-2.5 rounded-full text-sm font-medium disabled:bg-gray-300">
        {saving ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
