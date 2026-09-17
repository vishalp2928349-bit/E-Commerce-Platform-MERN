import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${category._id}`}
      className="flex flex-col items-center gap-2 group"
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border group-hover:border-primary transition-colors">
        <img
          src={category.image?.url || "https://placehold.co/100x100?text=Cat"}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-xs font-medium text-gray-700 group-hover:text-primary">{category.name}</span>
    </Link>
  );
}
