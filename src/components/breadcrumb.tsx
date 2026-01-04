interface BreadcrumbProps {
  paths: string[]
}

export function Breadcrumb({ paths }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="select-none">
      <ol className="flex items-center gap-2 md:gap-3 text-base md:text-lg">
        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;

          return (
            <li key={index} className="flex items-center transition-colors">
              <span
                className={`px-3 py-1.5 rounded-lg ${
                  isLast
                    ? "text-gray-900 bg-gray-100/80"
                    : " text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } transition-all duration-200`}
              >
                {path}
              </span>

              {!isLast && (
                <svg
                  className="w-5 h-5 mx-1 text-gray-400 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
