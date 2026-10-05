import React from 'react';
import { ShoppingBag, Plus, LogIn, LogOut, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({
  onOpenAddModal,
  onOpenLoginModal,
  onOpenCart,
  cartCount,
}) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand */}
        <div className="navbar-brand">
          <div className="brand-logo-icon">
            <ShoppingBag size={24} />
          </div>
          <div>
            <span className="brand-title">NovaStore</span>
            <span className="brand-subtitle">Product Catalog</span>
          </div>
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Admin badge if logged in */}
          {isAdmin && (
            <div className="admin-status-badge">
              <ShieldCheck size={16} />
              <span>Admin Mode</span>
            </div>
          )}

          {/* Add Product Button (Admin only) */}
          {isAdmin && (
            <button
              onClick={onOpenAddModal}
              className="btn btn-primary btn-add-product"
              title="Add a new product"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          )}

          {/* Cart preview button */}
          <button
            onClick={onOpenCart}
            className="cart-button"
            title="View Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* Auth Button */}
          {user ? (
            <div className="user-profile-menu">
              <div className="user-info">
                <span className="user-name">{user.name || user.email.split('@')[0]}</span>
                <span className="user-role-tag">{isAdmin ? 'ADMIN' : 'USER'}</span>
              </div>
              <button
                onClick={logout}
                className="btn btn-outline btn-logout"
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="btn btn-secondary btn-login"
            >
              <LogIn size={18} />
              <span>Admin Login</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
