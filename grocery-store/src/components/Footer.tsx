import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-gray-200 bg-white/95 backdrop-blur">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
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
              <li><Link to="/about" className="text-gray-600 hover:text-primary">About</Link></li>
              <li><Link to="/team" className="text-gray-600 hover:text-primary">Team</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-primary">FAQ</Link></li>
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

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-gray-900 uppercase">Social Media</h3>
            <p className="mt-3 text-sm text-gray-600">
              Follow us for offers, fresh updates, and healthy shopping tips.
            </p>
            <div className="mt-4 flex flex-col items-start gap-2">
              <a
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition text-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8.1V12h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2 .2 2 .2v2.2h-1.1c-1.1 0-1.4.7-1.4 1.3V12H17l-.5 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition text-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition text-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M22 5.8c-.7.3-1.5.5-2.3.6.8-.5 1.4-1.2 1.7-2.1-.8.5-1.6.8-2.5 1A3.6 3.6 0 0 0 12.9 8a10.2 10.2 0 0 1-7.4-3.8 3.6 3.6 0 0 0 1.1 4.8c-.6 0-1.1-.2-1.6-.4v.1c0 1.7 1.2 3.1 2.8 3.4-.5.1-1 .1-1.5 0 .4 1.4 1.8 2.4 3.3 2.4A7.3 7.3 0 0 1 2 17.3a10.2 10.2 0 0 0 5.6 1.6c6.7 0 10.4-5.7 10.4-10.6v-.5c.7-.5 1.4-1.2 1.9-2Z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition text-gray-600"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12s0-4-1-5-5-1-9-1-8 0-9 1-1 5-1 5 0 4 1 5 5 1 9 1 8 0 9-1 1-5 1-5Z" />
                  <path d="M10 15V9l6 3-6 3Z" />
                </svg>
              </a>
            </div>
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
