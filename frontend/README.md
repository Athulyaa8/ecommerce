# NovaStore - Frontend (Product Module)

Modern React frontend for the E-Commerce Product Module, built with Vite, React 18, Lucide Icons, and Vanilla CSS.

---

## 🚀 Features

- **Product Catalog Grid**:
  - Live product listing with real-time stock indicators (`In Stock`, `Only X left!`, `Out of Stock`).
  - High-resolution images with fallback placeholders.
  - Price & category badges.
- **Search & Filtering**:
  - Debounced real-time text search by product name.
  - Dynamic category pills fetched directly from the backend (`/api/products/categories`).
  - Price range filtering (Min price & Max price).
  - Multi-attribute sorting (Name A-Z / Z-A, Price Low-High / High-Low, Stock).
  - Results count and one-click "Reset Filters".
- **Pagination**:
  - Page navigation with custom page size selector (8, 12, 24, 48 items/page).
- **Product Detail Modal**:
  - High-res image, stock count, category, full description, and quantity controls.
- **Admin Management (CRUD)**:
  - **Admin Login Modal** with a 1-click **"⚡ Auto-Fill"** button for default developer credentials (`admin@example.com` / `admin123`).
  - **Add Product Modal**: Form with live image preview and validation.
  - **Edit Product Modal**: Edit existing product details and inventory.
  - **Delete Confirmation Dialog**: Safe deletion of products with warning prompt.
- **Shopping Cart**:
  - Slide-out cart drawer with quantity toggling, line total calculations, and subtotal.
- **Toast Notifications**:
  - Interactive toast notifications for user and admin actions.

---

## 🛠️ Quick Start

### 1. Start the Spring Boot Backend (Port 8081)
From the root `ecommerce` directory:
```bash
./mvnw.cmd spring-boot:run
```
*(Backend runs at `http://localhost:8081`)*

### 2. Start the React Frontend (Port 5173)
From the `ecommerce/frontend` directory:
```bash
cd frontend
npm run dev
```
*(Frontend runs at `http://localhost:5173`)*
