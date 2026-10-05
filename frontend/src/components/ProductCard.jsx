import React, { useState } from 'react';
import { ShoppingCart, Eye, Edit3, Trash2, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({
  product,
  onViewDetails,
  onEdit,
  onDelete,
  onAddToCart,
}) {
  const { isAdmin } = useAuth();
  const [imageError, setImageError] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  // Fallback image handling
  const defaultPlaceholder = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
  const displayImage = !imageError && product.imageUrl && product.imageUrl.trim()
    ? product.imageUrl
    : defaultPlaceholder;

  return (
    <div className={`product-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      {/* Product Image & Badges */}
      <div className="product-image-wrapper" onClick={() => onViewDetails(product)}>
        <img
          src={displayImage}
          alt={product.name}
          className="product-image"
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Category Pill */}
        <span className="product-category-pill">{product.category}</span>

        {/* Stock Badge */}
        <div className="product-stock-tag">
          {isOutOfStock ? (
            <span className="stock-badge badge-out">Out of Stock</span>
          ) : isLowStock ? (
            <span className="stock-badge badge-low">Only {product.stock} left!</span>
          ) : (
            <span className="stock-badge badge-in">{product.stock} in stock</span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <h3
          className="product-title"
          onClick={() => onViewDetails(product)}
          title={product.name}
        >
          {product.name}
        </h3>

        <p className="product-desc" title={product.description}>
          {product.description}
        </p>

        <div className="product-pricing-row">
          <div className="product-price">
            <span className="price-currency">$</span>
            <span className="price-value">{product.price.toFixed(2)}</span>
          </div>

          {/* Quick View Button */}
          <button
            onClick={() => onViewDetails(product)}
            className="btn-quick-view"
            title="View Details"
          >
            <Eye size={16} />
            <span>Details</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="product-card-actions">
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`btn btn-add-cart ${isOutOfStock ? 'disabled' : ''}`}
          >
            <ShoppingCart size={16} />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
          </button>

          {/* Admin Management Buttons */}
          {isAdmin && (
            <div className="admin-card-actions">
              <button
                onClick={() => onEdit(product)}
                className="btn-icon btn-edit"
                title="Edit Product"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => onDelete(product)}
                className="btn-icon btn-delete"
                title="Delete Product"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
