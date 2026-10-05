import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  totalElements,
}) {
  if (totalPages <= 1 && totalElements <= pageSize) return null;

  // Generate page numbers
  const pages = [];
  const maxButtons = 5;
  let startPage = Math.max(0, currentPage - 2);
  let endPage = Math.min(totalPages - 1, startPage + maxButtons - 1);

  if (endPage - startPage + 1 < maxButtons) {
    startPage = Math.max(0, endPage - maxButtons + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="pagination-bar">
      {/* Page Size Selector */}
      <div className="page-size-selector">
        <label htmlFor="page-size" className="page-size-label">Per page:</label>
        <select
          id="page-size"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="page-size-select"
        >
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
          <option value={48}>48</option>
        </select>
      </div>

      {/* Navigation Buttons */}
      <div className="pagination-nav-group">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="btn-page-arrow"
          title="Previous Page"
        >
          <ChevronLeft size={18} />
        </button>

        {startPage > 0 && (
          <>
            <button
              onClick={() => onPageChange(0)}
              className="btn-page-number"
            >
              1
            </button>
            {startPage > 1 && <span className="page-ellipsis">&hellip;</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`btn-page-number ${p === currentPage ? 'active' : ''}`}
          >
            {p + 1}
          </button>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="page-ellipsis">&hellip;</span>}
            <button
              onClick={() => onPageChange(totalPages - 1)}
              className="btn-page-number"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="btn-page-arrow"
          title="Next Page"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Total Info */}
      <div className="pagination-info">
        <span>Page {currentPage + 1} of {totalPages || 1}</span>
      </div>
    </div>
  );
}
