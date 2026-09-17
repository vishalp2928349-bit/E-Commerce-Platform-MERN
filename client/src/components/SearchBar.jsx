import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function SearchBar({ initialValue = "" }) {
  const [keyword, setKeyword] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(keyword.trim() ? `/shop?keyword=${encodeURIComponent(keyword)}` : "/shop");
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        type="text"
        placeholder="Search products..."
        className="w-full border border-gray-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <FiSearch />
      </button>
    </form>
  );
}
