import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisible?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisible / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="p-2 text-gray-600 border border-gray-200 rounded-md hover:border-midnight-950 hover:text-midnight-950 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pageNumbers.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
              ...
            </span>
          );
        }

        const isCurrentPage = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
              isCurrentPage
                ? 'bg-midnight-950 text-white'
                : 'border border-gray-200 text-midnight-950 hover:border-midnight-950'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="p-2 text-gray-600 border border-gray-200 rounded-md hover:border-midnight-950 hover:text-midnight-950 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
