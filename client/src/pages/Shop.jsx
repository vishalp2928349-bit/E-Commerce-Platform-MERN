import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice.js";
import ProductCard from "../components/ProductCard.jsx";
import FilterSidebar from "../components/FilterSidebar.jsx";
import Pagination from "../components/Pagination.jsx";
import SkeletonLoader from "../components/SkeletonLoader.jsx";

export default function Shop() {
  const dispatch = useDispatch();
  const { items, loading, page, pages } = useSelector((state) => state.products);
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    minPrice: "",
    maxPrice: "",
    rating: "",
    availability: "",
  });
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const keyword = searchParams.get("keyword") || "";

  useEffect(() => {
    dispatch(
      fetchProducts({
        ...filters,
        keyword,
        sort,
        page: currentPage,
        limit: 12,
      })
    );
  }, [dispatch, filters, sort, currentPage, keyword]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-1">{keyword ? `Results for "${keyword}"` : "Shop"}</h1>
      <p className="text-sm text-gray-500 mb-6">Browse our full catalog</p>

      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebar filters={filters} onChange={(f) => { setFilters(f); setCurrentPage(1); }} />

        <div className="flex-1">
          <div className="flex justify-end mb-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="top-rated">Highest Rated</option>
              <option value="best-selling">Best Selling</option>
            </select>
          </div>

          {loading ? (
            <SkeletonLoader count={12} />
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 py-20">No products found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {items.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}

          <Pagination page={page} pages={pages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}
