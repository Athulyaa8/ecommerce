// API Base URL - empty string when using Vite proxy in development, or fallback to backend port 8081
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';

/**
 * Helper to get authorization headers if token exists
 */
function getAuthHeaders() {
  const token = localStorage.getItem('ecommerce_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Handle API responses and extract error messages
 */
async function handleResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    if (typeof data === 'object' && data !== null) {
      errorMsg = data.message || JSON.stringify(data);
    } else if (typeof data === 'string') {
      errorMsg = data;
    }
    throw new Error(errorMsg || `Request failed with status ${response.status}`);
  }

  return data;
}

/**
 * Fetch paginated & filtered products
 */
export async function getProducts({
  search = '',
  category = '',
  minPrice = '',
  maxPrice = '',
  page = 0,
  size = 12,
  sort = 'name,asc',
} = {}) {
  const params = new URLSearchParams();

  if (search && search.trim()) params.append('search', search.trim());
  if (category && category.trim()) params.append('category', category.trim());
  if (minPrice !== '' && !isNaN(minPrice)) params.append('minPrice', minPrice);
  if (maxPrice !== '' && !isNaN(maxPrice)) params.append('maxPrice', maxPrice);
  params.append('page', page);
  params.append('size', size);
  params.append('sort', sort);

  const url = `${API_BASE_URL}/api/products?${params.toString()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
}

/**
 * Fetch all distinct categories
 */
export async function getCategories() {
  const url = `${API_BASE_URL}/api/products/categories`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await handleResponse(response);
  } catch (err) {
    console.warn('Could not fetch categories from server, will derive from products', err);
    return [];
  }
}

/**
 * Fetch a single product by ID
 */
export async function getProductById(id) {
  const url = `${API_BASE_URL}/api/products/${id}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

/**
 * Create a new product (Requires ADMIN)
 */
export async function createProduct(productData) {
  const url = `${API_BASE_URL}/api/products`;
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

/**
 * Update an existing product (Requires ADMIN)
 */
export async function updateProduct(id, productData) {
  const url = `${API_BASE_URL}/api/products/${id}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

/**
 * Delete a product (Requires ADMIN)
 */
export async function deleteProduct(id) {
  const url = `${API_BASE_URL}/api/products/${id}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

/**
 * Login user / admin to obtain JWT
 */
export async function loginUser(email, password) {
  const url = `${API_BASE_URL}/api/auth/login`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}
