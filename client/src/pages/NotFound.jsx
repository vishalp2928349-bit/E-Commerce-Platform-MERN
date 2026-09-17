import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="bg-primary text-white px-6 py-3 rounded-full font-medium">
        Back to Home
      </Link>
    </div>
  );
}
