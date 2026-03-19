import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link to="/" className="text-2xl font-bold text-primary">
              Grocery
            </Link>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Fresh groceries delivered fast, with trusted quality and smooth ordering.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/" className="text-gray-600 hover:text-primary">Home</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-primary">Blog</Link></li>
              <li><Link to="/cart" className="text-gray-600 hover:text-primary">Cart</Link></li>
              <li><Link to="/orders" className="text-gray-600 hover:text-primary">My Orders</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>Help Center</li>
              <li>Shipping & Delivery</li>
              <li>Terms & Privacy</li>
              <li>Returns Policy</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li>support@grocery.com</li>
              <li>+91 98765 43210</li>
              <li>Mon-Sat, 9:00 AM - 8:00 PM</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-gray-100 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">© {year} Grocery. All rights reserved.</p>
          <p className="text-xs text-gray-500">Made with care for better everyday shopping.</p>
        </div>
      </div>
    </footer>
  );
}
