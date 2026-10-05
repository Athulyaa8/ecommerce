import React, { useState } from 'react';
import { AlertTriangle, Trash2, X, Loader2 } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  product,
  onClose,
  onConfirm,
}) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm(product.id);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content delete-modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="delete-modal-body">
          <div className="delete-icon-wrapper">
            <AlertTriangle size={32} className="text-rose-500" />
          </div>

          <h3 className="delete-title">Delete Product?</h3>
          <p className="delete-text">
            Are you sure you want to remove <strong>"{product.name}"</strong>? This action cannot be undone.
          </p>

          <div className="delete-product-summary">
            <span>Price: ${product.price?.toFixed(2)}</span>
            <span>&bull;</span>
            <span>Category: {product.category}</span>
          </div>

          <div className="delete-modal-actions">
            <button
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn btn-danger"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Yes, Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
