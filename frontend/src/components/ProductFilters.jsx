import React from 'react';
import { Search, SlidersHorizontal, RotateCcw, X } from 'lucide-react';

export default function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories,
  minPrice,
  onMinPriceChange,
  maxPrice,
  onMaxPriceChange,
  sort,
  onSortChange,
  onResetFilters,
  totalResults,
}) {
  const hasActiveFilters = Boolean(
    search || category || minPrice !== '' || maxPrice !== '' || sort !== 'name,asc'
  );

  return (
    <section className="filters-section">
      <div className="filters-top-bar">
        {/* Search Bar */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by name..."
            className="search-input"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="search-clear-btn"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="sort-wrapper">
          <label htmlFor="sort-select" className="sort-label">
            <SlidersHorizontal size={16} />
            <span>Sort by:</span>
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="sort-select"
          >
            <option value="name,asc">Name: A to Z</option>
            <option value="name,desc">Name: Z to A</option>
            <option value="price,asc">Price: Low to High</option>
            <option value="price,desc">Price: High to Low</option>
            <option value="stock,desc">Stock: Highest First</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="category-chips-row">
        <span className="chips-label">Categories:</span>
        <div className="chips-list">
          <button
            onClick={() => onCategoryChange('')}
            className={`category-chip ${category === '' ? 'active' : ''}`}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`category-chip ${category.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range & Quick Reset Row */}
      <div className="filters-bottom-row">
        <div className="price-inputs-group">
          <span className="price-label">Price Range:</span>
          <div className="price-input-box">
            <span>$</span>
            <input
              type="number"
              min="0"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => onMinPriceChange(e.target.value)}
              className="price-input"
            />
          </div>
          <span className="price-separator">—</span>
          <div className="price-input-box">
            <span>$</span>
            <input
              type="number"
              min="0"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => onMaxPriceChange(e.target.value)}
              className="price-input"
            />
          </div>
        </div>

        {/* Results Count & Reset Button */}
        <div className="results-and-reset">
          <span className="results-counter">
            <strong>{totalResults}</strong> {totalResults === 1 ? 'product' : 'products'} found
          </span>
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="btn btn-reset-filters"
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
