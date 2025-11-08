import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  separator?: React.ReactNode;
  className?: string;
}

export default function Breadcrumb({
  items,
  showHomeIcon = true,
  separator,
  className = '',
}: BreadcrumbProps) {
  const defaultSeparator = <ChevronRight className="w-4 h-4 text-gray-400" />;

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 ${className}`}>
      <ol className="flex items-center gap-2 flex-wrap">
        {showHomeIcon && (
          <>
            <li>
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-primary-500 transition-colors"
              >
                <Home className="w-4 h-4" />
              </Link>
            </li>
            {items.length > 0 && (
              <li className="flex items-center">
                {separator || defaultSeparator}
              </li>
            )}
          </>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-sm text-gray-600 hover:text-primary-500 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={`text-sm ${
                    isLast
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <span className="flex items-center">
                  {separator || defaultSeparator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
