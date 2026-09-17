import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiStar, FiShoppingCart, FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import { fetchProductById } from "../redux/slices/productSlice.js";
import { addToCart } from "../redux/slices/cartSlice.js";
import { addToWishlist } from "../redux/slices/wishlistSlice.js";
import { addReview } from "../services/reviewService.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { current: product, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await addReview(id, reviewForm);
      toast.success("Review submitted");
      dispatch(fetchProductById(id));
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  if (loading || !product) return <LoadingSpinner full />;

  const discountedPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : product.price.toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-3">
            <img
              src={product.images?.[activeImage]?.url || "https://placehold.co/600x600"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  i === activeImage ? "border-primary" : "border-transparent"
                }`}
              >
                <img src={img.url} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
          <div className="flex items-center gap-1 text-sm text-yellow-500 mb-3">
            <FiStar className="fill-yellow-400" />
            <span>{product.rating?.toFixed(1)}</span>
            <span className="text-gray-400">({product.numReviews} reviews)</span>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-gray-900">${discountedPrice}</span>
            {product.discount > 0 && (
              <span className="text-gray-400 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-6">{product.description}</p>

          {product.specifications?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-sm mb-2">Specifications</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {product.specifications.map((s, i) => (
                  <li key={i}><span className="font-medium">{s.key}:</span> {s.value}</li>
                ))}
              </ul>
            </div>
          )}

          <p className={`text-sm mb-4 ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center border rounded-full">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
              <span className="px-3">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="px-3 py-2">+</button>
            </div>
            <button
              disabled={product.stock === 0}
              onClick={() => dispatch(addToCart({ productId: product._id, quantity }))}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-full font-medium hover:bg-primary-dark disabled:bg-gray-300"
            >
              <FiShoppingCart /> Add to Cart
            </button>
            <button
              onClick={() => dispatch(addToWishlist(product._id))}
              className="border rounded-full p-3 text-gray-500 hover:text-red-500"
            >
              <FiHeart />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-14 max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        <div className="space-y-4 mb-8">
          {product.reviews?.length === 0 && <p className="text-sm text-gray-500">No reviews yet.</p>}
          {product.reviews?.map((r) => (
            <div key={r._id} className="border-b pb-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                {r.name}
                <span className="flex items-center text-yellow-500 text-xs"><FiStar className="fill-yellow-400" /> {r.rating}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{r.comment}</p>
            </div>
          ))}
        </div>

        {user ? (
          <form onSubmit={submitReview} className="space-y-3">
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
            </select>
            <textarea
              required
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              placeholder="Share your thoughts..."
              className="w-full border rounded-lg px-3 py-2 text-sm"
              rows={3}
            />
            <button type="submit" className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium">
              Submit Review
            </button>
          </form>
        ) : (
          <p className="text-sm text-gray-500">Log in to leave a review.</p>
        )}
      </div>
    </div>
  );
}
