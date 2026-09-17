import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FiHeart, FiShoppingCart, FiStar } from "react-icons/fi";
import { addToCart } from "../redux/slices/cartSlice.js";
import { addToWishlist } from "../redux/slices/wishlistSlice.js";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : product.price.toFixed(2);

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <Link to={`/product/${product._id}`} className="block relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]?.url || "https://placehold.co/400x400?text=No+Image"}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            -{product.discount}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch(addToWishlist(product._id));
          }}
          className="absolute top-2 right-2 bg-white/90 p-2 rounded-full text-gray-500 hover:text-red-500"
        >
          <FiHeart size={16} />
        </button>
      </Link>

      <div className="p-3">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-1">{product.title}</h3>
        </Link>
        <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
          <FiStar className="fill-yellow-400" />
          <span>{product.rating?.toFixed(1) || "0.0"}</span>
          <span className="text-gray-400">({product.numReviews || 0})</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="font-semibold text-gray-900">${discountedPrice}</span>
            {product.discount > 0 && (
              <span className="text-xs text-gray-400 line-through ml-1">${product.price.toFixed(2)}</span>
            )}
          </div>
          <button
            onClick={() => dispatch(addToCart({ productId: product._id, quantity: 1 }))}
            disabled={product.stock === 0}
            className="text-primary hover:text-primary-dark disabled:text-gray-300"
          >
            <FiShoppingCart size={18} />
          </button>
        </div>
        {product.stock === 0 && <p className="text-xs text-red-500 mt-1">Out of stock</p>}
      </div>
    </div>
  );
}
