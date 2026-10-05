import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, AlertCircle, Loader2 } from 'lucide-react';

export default function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialProduct = null,
  categories = [],
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  const isEditing = Boolean(initialProduct && initialProduct.id);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || '',
        description: initialProduct.description || '',
        price: initialProduct.price != null ? String(initialProduct.price) : '',
        category: initialProduct.category || '',
        stock: initialProduct.stock != null ? String(initialProduct.stock) : '',
        imageUrl: initialProduct.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories.length > 0 ? categories[0] : '',
        stock: '10',
        imageUrl: '',
      });
    }
    setErrors({});
    setPreviewError(false);
  }, [initialProduct, isOpen, categories]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (!formData.category.trim()) errs.category = 'Category is required';

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Price must be a positive number';
    }

    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      errs.stock = 'Stock must be 0 or greater';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        imageUrl: formData.imageUrl.trim() || undefined,
      };

      await onSubmit(payload, initialProduct?.id);
      onClose();
    } catch (err) {
      setErrors(prev => ({ ...prev, server: err.message || 'Failed to save product' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content form-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-heading">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="modal-subheading">
              {isEditing
                ? 'Update product details, pricing, and inventory'
                : 'Fill in the information to add a product to the catalog'}
            </p>
          </div>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        {/* Server Error Alert */}
        {errors.server && (
          <div className="form-alert-error">
            <AlertCircle size={18} />
            <span>{errors.server}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            {/* Left column: inputs */}
            <div className="form-inputs-col">
              {/* Product Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="prod-name">Product Name *</label>
                <input
                  id="prod-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wireless Noise-Cancelling Headphones"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="prod-category">Category *</label>
                <input
                  id="prod-category"
                  type="text"
                  list="categories-datalist"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Electronics, Footwear, Fashion"
                  className={`form-input ${errors.category ? 'input-error' : ''}`}
                />
                <datalist id="categories-datalist">
                  {categories.map(cat => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && <span className="field-error">{errors.category}</span>}
              </div>

              {/* Price & Stock Row */}
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="prod-price">Price ($) *</label>
                  <input
                    id="prod-price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    placeholder="29.99"
                    className={`form-input ${errors.price ? 'input-error' : ''}`}
                  />
                  {errors.price && <span className="field-error">{errors.price}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="prod-stock">Stock Quantity *</label>
                  <input
                    id="prod-stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className={`form-input ${errors.stock ? 'input-error' : ''}`}
                  />
                  {errors.stock && <span className="field-error">{errors.stock}</span>}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label" htmlFor="prod-desc">Description *</label>
                <textarea
                  id="prod-desc"
                  rows="3"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed description of features, specifications, and materials..."
                  className={`form-textarea ${errors.description ? 'input-error' : ''}`}
                />
                {errors.description && <span className="field-error">{errors.description}</span>}
              </div>
            </div>

            {/* Right column: Image URL & Preview */}
            <div className="form-image-col">
              <div className="form-group">
                <label className="form-label" htmlFor="prod-img">Image URL (Optional)</label>
                <input
                  id="prod-img"
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    setPreviewError(false);
                  }}
                  placeholder="https://example.com/image.jpg"
                  className="form-input"
                />
              </div>

              {/* Live Preview Box */}
              <div className="image-preview-card">
                <span className="preview-label">Live Image Preview:</span>
                <div className="preview-box">
                  {formData.imageUrl && !previewError ? (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="preview-img"
                      onError={() => setPreviewError(true)}
                    />
                  ) : (
                    <div className="preview-placeholder">
                      <ImageIcon size={36} className="placeholder-icon" />
                      <span>{previewError ? 'Failed to load image URL' : 'No image URL provided'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="modal-actions-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-save-product"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{isEditing ? 'Update Product' : 'Create Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
