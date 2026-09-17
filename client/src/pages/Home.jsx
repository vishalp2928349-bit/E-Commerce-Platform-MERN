import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice.js";
import { fetchCategories } from "../services/categoryService.js";
import ProductCard from "../components/ProductCard.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import SkeletonLoader from "../components/SkeletonLoader.jsx";

export default function Home() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.products);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8, sort: "newest" }));
    fetchCategories().then(setCategories).catch(() => {});
  }, [dispatch]);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-indigo-400 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Shop Smarter, Live Better</h1>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">
            Discover curated products across every category — quality guaranteed, delivered fast.
          </p>
          <Link to="/shop" className="bg-white text-primary font-semibold px-6 py-3 rounded-full hover:bg-gray-100">
            Shop Now
          </Link>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-xl font-semibold mb-6">Shop by Category</h2>
          <div className="flex gap-6 overflow-x-auto pb-2">
            {categories.map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Featured Products</h2>
          <Link to="/shop" className="text-sm text-primary font-medium">View all</Link>
        </div>
        {loading ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
