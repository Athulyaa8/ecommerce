import React, { useState } from 'react';
import { X, ShoppingCart, Check, AlertCircle, Edit3, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onEdit,
  onDelete,
}) {
  const { isAdmin } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const defaultPlaceholder = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
  const displayImage = !imageError && product.imageUrl && product.imageUrl.trim()
    ? product.imageUrl
    : defaultPlaceholder;

  const handleIncrement = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAdd = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content product-detail-modal" onClick={e => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="modal-detail-grid">
          {/* Left: Product Image */}
          <div className="modal-image-col">
            <div className="modal-image-container">
              <img
                src={displayImage}
                alt={product.name}
                className="modal-product-img"
                onError={() => setImageError(true)}
              />
              <span className="modal-category-badge">{product.category}</span>
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="modal-info-col">
            <div className="modal-header-meta">
              <h2 className="modal-product-title">{product.name}</h2>
              <div className="modal-stock-status">
                {isOutOfStock ? (
                  <span className="stock-badge badge-out">
                    <AlertCircle size={14} /> Out of Stock
                  </span>
                ) : isLowStock ? (
                  <span className="stock-badge badge-low">
                    <AlertCircle size={14} /> Only {product.stock} items left
                  </span>
                ) : (
                  <span className="stock-badge badge-in">
                    <Check size={14} /> In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            <div className="modal-price-tag">
              <span className="modal-currency">$</span>
              <span className="modal-price-val">{product.price.toFixed(2)}</span>
            </div>

            <div className="modal-description-box">
              <h4 className="detail-section-title">Description</h4>
              <p className="detail-description-text">{product.description}</p>
            </div>

            {/* Quantity Selector & Add to Cart */}
            {!isOutOfStock && (
              <div className="modal-purchase-controls">
                <div className="quantity-selector">
                  <span className="qty-label">Quantity:</span>
                  <div className="qty-buttons-group">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      onClick={handleIncrement}
                      disabled={quantity >= product.stock}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  className="btn btn-primary btn-modal-cart"
                >
                  <ShoppingCart size={18} />
                  <span>Add {quantity} to Cart &bull; ${(product.price * quantity).toFixed(2)}</span>
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="out-of-stock-alert">
                <AlertCircle size={18} />
                <span>This item is currently out of stock. Please check back later!</span>
              </div>
            )}

            {/* Admin Management Section */}
            {isAdmin && (
              <div className="modal-admin-footer">
                <span className="admin-footer-label">Admin Management:</span>
                <div className="admin-footer-buttons">
                  <button
                    onClick={() => {
                      onClose();
                      onEdit(product);
                    }}
                    className="btn btn-outline btn-sm"
                  >
                    <Edit3 size={15} /> Edit Product
                  </button>
                  <button
                    onClick={() => {
                      onClose();
                      onDelete(product);
                    }}
                    className="btn btn-danger-outline btn-sm"
                  >
                    <Trash2 size={15} /> Delete Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
