import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import ProductDetailModal from './components/ProductDetailModal';
import ProductFormModal from './components/ProductFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import LoginModal from './components/LoginModal';
import CartDrawer from './components/CartDrawer';
import Pagination from './components/Pagination';
import Toast from './components/Toast';
import { useAuth } from './context/AuthContext';
import {
  getProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} from './services/api';
import { Package, Plus, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export default function App() {
  const { isAdmin } = useAuth();

  // Products & Pagination State
  const [products, setProducts] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Filter State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('name,asc');

  // Modals & Drawers
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart & Toast
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('ecommerce_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('ecommerce_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0); // Reset to page 0 on search change
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Load distinct categories once
  const loadCategories = async () => {
    try {
      const cats = await getCategories();
      if (Array.isArray(cats) && cats.length > 0) {
        setCategories(cats);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Fetch products from backend
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProducts({
        search: debouncedSearch,
        category,
        minPrice,
        maxPrice,
        page: currentPage,
        size: pageSize,
        sort,
      });

      // Spring Data Page returns { content, totalElements, totalPages, number, ... }
      if (data && Array.isArray(data.content)) {
        setProducts(data.content);
        setTotalElements(data.totalElements ?? data.content.length);
        setTotalPages(data.totalPages ?? 1);
      } else if (Array.isArray(data)) {
        setProducts(data);
        setTotalElements(data.length);
        setTotalPages(1);
      } else {
        setProducts([]);
        setTotalElements(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      showToast(err.message || 'Failed to fetch products. Check if backend is running on port 8081.', 'error');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, category, minPrice, maxPrice, currentPage, pageSize, sort]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // CRUD Handlers
  const handleSaveProduct = async (formData, id) => {
    if (id) {
      // Edit
      const updated = await updateProduct(id, formData);
      showToast(`Product "${updated.name}" updated successfully!`);
    } else {
      // Create
      const created = await createProduct(formData);
      showToast(`Product "${created.name}" created successfully!`);
    }
    loadProducts();
    loadCategories();
  };

  const handleConfirmDelete = async (id) => {
    await deleteProduct(id);
    showToast('Product deleted successfully');
    loadProducts();
    loadCategories();
  };

  // Cart Handlers
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity} × ${product.name} to cart!`);
  };

  const handleUpdateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Filter Reset
  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('name,asc');
    setCurrentPage(0);
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Top Navbar */}
      <Navbar
        onOpenAddModal={() => {
          setEditingProduct(null);
          setIsFormModalOpen(true);
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Hero Banner */}
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={16} />
            <span>Discover Premium Products</span>
          </div>
          <h1 className="hero-title">
            Curated Quality & <span className="gradient-text">Exceptional Value</span>
          </h1>
          <p className="hero-subtitle">
            Explore our collection of top-rated items with instant search, real-time filtering, and fast delivery.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="main-content-container">
        {/* Filters and Search Bar */}
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={(cat) => {
            setCategory(cat);
            setCurrentPage(0);
          }}
          categories={categories}
          minPrice={minPrice}
          onMinPriceChange={(val) => {
            setMinPrice(val);
            setCurrentPage(0);
          }}
          maxPrice={maxPrice}
          onMaxPriceChange={(val) => {
            setMaxPrice(val);
            setCurrentPage(0);
          }}
          sort={sort}
          onSortChange={setSort}
          onResetFilters={handleResetFilters}
          totalResults={totalElements}
        />

        {/* Product Catalog Grid */}
        <section className="catalog-section">
          {loading ? (
            <div className="products-grid skeleton-grid">
              {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="skeleton-card">
                  <div className="skeleton-image" />
                  <div className="skeleton-line title" />
                  <div className="skeleton-line text" />
                  <div className="skeleton-line price" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onViewDetails={(p) => setDetailProduct(p)}
                    onEdit={(p) => {
                      setEditingProduct(p);
                      setIsFormModalOpen(true);
                    }}
                    onDelete={(p) => setDeletingProduct(p)}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(newSize) => {
                  setPageSize(newSize);
                  setCurrentPage(0);
                }}
                totalElements={totalElements}
              />
            </>
          ) : (
            <div className="empty-catalog-state">
              <Package size={56} className="empty-icon" />
              <h3>No products found</h3>
              <p>
                {search || category || minPrice || maxPrice
                  ? 'No products matched your search and filter criteria.'
                  : 'There are currently no products available in the store.'}
              </p>
              <div className="empty-actions">
                {(search || category || minPrice || maxPrice) && (
                  <button onClick={handleResetFilters} className="btn btn-secondary">
                    <RefreshCw size={16} />
                    <span>Reset Filters</span>
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsFormModalOpen(true);
                    }}
                    className="btn btn-primary"
                  >
                    <Plus size={16} />
                    <span>Add First Product</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={handleAddToCart}
          onEdit={(p) => {
            setDetailProduct(null);
            setEditingProduct(p);
            setIsFormModalOpen(true);
          }}
          onDelete={(p) => {
            setDetailProduct(null);
            setDeletingProduct(p);
          }}
        />
      )}

      {/* Product Add / Edit Form Modal */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        initialProduct={editingProduct}
        categories={categories}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingProduct(null);
        }}
        onSubmit={handleSaveProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingProduct)}
        product={deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Admin Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(msg) => showToast(msg, 'success')}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>&copy; {new Date().getFullYear()} NovaStore &bull; E-Commerce Product Module</p>
          <p className="footer-sub">Spring Boot 4 + MongoDB Backend &bull; React Frontend</p>
        </div>
      </footer>
    </div>
  );
}
