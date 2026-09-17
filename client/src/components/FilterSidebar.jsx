import { useState, useEffect } from "react";
import { fetchCategories } from "../services/categoryService.js";

export default function FilterSidebar({ filters, onChange }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const update = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <aside className="w-full md:w-56 shrink-0 space-y-6">
      <div>
        <h4 className="font-medium text-sm text-gray-800 mb-2">Category</h4>
        <div className="space-y-1">
          <button
            onClick={() => update("category", "")}
            className={`block text-sm ${!filters.category ? "text-primary font-medium" : "text-gray-600"}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => update("category", c._id)}
              className={`block text-sm ${filters.category === c._id ? "text-primary font-medium" : "text-gray-600"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm text-gray-800 mb-2">Price Range</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ""}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full border rounded-lg px-2 py-1 text-sm"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ""}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full border rounded-lg px-2 py-1 text-sm"
          />
        </div>
      </div>

      <div>
        <h4 className="font-medium text-sm text-gray-800 mb-2">Minimum Rating</h4>
        <div className="flex gap-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => update("rating", filters.rating === String(r) ? "" : String(r))}
              className={`px-2 py-1 text-xs rounded-full border ${
                filters.rating === String(r) ? "bg-primary text-white border-primary" : "text-gray-600"
              }`}
            >
              {r}+
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={filters.availability === "true"}
            onChange={(e) => update("availability", e.target.checked ? "true" : "")}
          />
          In stock only
        </label>
      </div>
    </aside>
  );
}
