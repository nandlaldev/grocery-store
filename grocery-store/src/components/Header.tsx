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
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-primary shrink-0">
          Grocery
        </Link>
        {showSearch && (
          <div className="flex-1 max-w-md">
            <input
              type="search"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        )}
        <div className="flex items-center gap-2 shrink-0">
          {showSearch && categories.length > 0 && (
            <select
              value={categoryValue}
              onChange={(e) => onCategoryChange?.(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          )}
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
      </div>
    </header>
  );
}
