import React from "react";
import { Ionicons } from '@expo/vector-icons';
import clsx from "clsx";

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  /**
   * Handles navigation to the previous page
   * Only triggers if current page is greater than 1
   */
  function handlePrevious() {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }

  /**
   * Handles navigation to the next page
   * Only triggers if current page is less than total pages
   */
  function handleNext() {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }

  /**
   * Generates an array of page numbers to display
   * Logic:
   * - If total pages ≤ 7: shows all pages
   * - Otherwise: shows first page, last page, current page ± 1, and ellipsis
   * @returns Array of page numbers and ellipsis strings
   */
  function getPageNumbers(): (number | string)[] {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    
    /**
     * Helper function to add ellipsis between page numbers
     * Only adds ellipsis if there's a gap of more than 1 page
     */
    function showEllipsis(start: number, end: number) {
      if (end - start > 1) {
        pages.push("...");
      }
    }

    // Always show first page
    pages.push(1);

    if (currentPage <= 3) {
      // When near the start: 1 ... 2 3 4 ... last
      showEllipsis(1, currentPage - 1);
      pages.push(2, 3, 4);
      showEllipsis(4, totalPages - 1);
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // When near the end: 1 ... last-3 last-2 last-1 last
      showEllipsis(1, totalPages - 4);
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      // When in the middle: 1 ... current-1 current current+1 ... last
      showEllipsis(1, currentPage - 2);
      pages.push(currentPage - 1, currentPage, currentPage + 1);
      showEllipsis(currentPage + 1, totalPages - 1);
      pages.push(totalPages);
    }

    return pages;
  }

  // Don't render if there's only one page or less
  if (totalPages <= 1) {
    return null;
  }

  // Base styles for the navigation container
  const navClasses = clsx("flex items-center justify-center gap-1");

  // Base styles for navigation buttons (prev/next)
  const buttonBaseClasses = clsx(
    "flex items-center justify-center w-10 h-10 rounded-full", // Changed to rounded-full
    "border border-slate-200 dark:border-slate-700",
    "hover:bg-slate-50 dark:hover:bg-dark2",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    "disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
  );

  // Dynamic styles for page number buttons
  function pageButtonClasses(page: number) {
    return clsx(
      "flex items-center justify-center w-10 h-10 rounded-full", // Changed to rounded-full
      "text-sm font-medium transition-colors",
      {
        "bg-blue text-white hover:bg-blue/90": page === currentPage,
        "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark2":
          page !== currentPage,
      }
    );
  }

  // Styles for ellipsis spans
  const ellipsisClasses = clsx("px-3 py-2 text-slate-500 dark:text-slate-400");

  return (
    <nav className={navClasses} aria-label="Pagination">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={buttonBaseClasses}
        aria-label="Previous page"
      >
        <Ionicons name="chevron-back" size={20} />
      </button>
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className={ellipsisClasses}
              aria-hidden="true"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={pageButtonClasses(page as number)}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          )
        )}
      </div>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={buttonBaseClasses}
        aria-label="Next page"
      >
        <Ionicons name="chevron-forward" size={20} />
      </button>
    </nav>
  );
}

export default Pagination;
