import { Link } from 'react-router-dom';
import AccountDropdown from './AccountDropdown';

type HeaderProps = {
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  categoryValue?: string;
  onCategoryChange?: (v: string) => void;
  categories?: string[];
};

export default function Header({
  showSearch = false,
  searchValue = '',
  onSearchChange,
  categoryValue = '',
  onCategoryChange,
  categories = [],
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3 sm:gap-4">
        <Link to="/" className="text-xl font-bold text-primary shrink-0">
          Grocery
        </Link>
        <div className="ml-auto flex items-center gap-2 shrink-0">
          <Link to="/blog" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
            Blog
          </Link>
          <Link
            to="/cart"
            className="p-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark whitespace-nowrap"
          >
            Cart
          </Link>
          <AccountDropdown />
        </div>
        {showSearch && (
          <div className="w-full flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="search"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full sm:flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {categories.length > 0 && (
              <select
                value={categoryValue}
                onChange={(e) => onCategoryChange?.(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
