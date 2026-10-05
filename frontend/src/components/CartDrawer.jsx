import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  items = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) {
  if (!isOpen) return null;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={e => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-header">
          <div className="cart-header-title">
            <ShoppingBag size={20} />
            <h3>Your Cart</h3>
            <span className="cart-items-count">({items.length})</span>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="empty-cart-state">
              <ShoppingBag size={48} className="empty-cart-icon" />
              <p className="empty-cart-title">Your cart is empty</p>
              <p className="empty-cart-subtitle">Browse products and add items to your cart</p>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="cart-item-row">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80'}
                    alt={product.name}
                    className="cart-item-thumb"
                  />
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{product.name}</h4>
                    <span className="cart-item-category">{product.category}</span>
                    <div className="cart-item-pricing">
                      <span className="cart-item-price">${product.price.toFixed(2)}</span>
                      <span className="cart-item-line-total">
                        Total: ${(product.price * quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="cart-item-controls">
                      <div className="cart-qty-toggle">
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                          className="cart-qty-btn"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="cart-qty-number">{quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                          className="cart-qty-btn"
                          disabled={quantity >= product.stock}
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(product.id)}
                        className="btn-remove-cart-item"
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-subtotal-row">
              <span>Subtotal:</span>
              <strong className="cart-total-value">${totalAmount.toFixed(2)}</strong>
            </div>
            <p className="cart-shipping-note">Taxes and shipping calculated at checkout</p>

            <button
              onClick={() => {
                alert(`Order simulated for $${totalAmount.toFixed(2)}! Thank you for testing.`);
                onClearCart();
                onClose();
              }}
              className="btn btn-primary btn-checkout"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
