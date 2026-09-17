export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-semibold mb-2">MERN Shop</h3>
          <p className="text-sm text-gray-400">Quality products, delivered fast.</p>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2 text-sm">Company</h4>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>About</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-medium mb-2 text-sm">Support</h4>
          <ul className="text-sm space-y-1 text-gray-400">
            <li>Help Center</li>
            <li>Returns</li>
            <li>Shipping Info</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} MERN Shop. All rights reserved.
      </div>
    </footer>
  );
}
