/**
 * API Client — fetch-based, reads base URL from VITE_API_BASE_URL.
 * All endpoints are prefixed with /api automatically.
 *
 * Handles:
 *  - JSON & non-JSON responses
 *  - Render free-tier sleep (503/502)
 *  - Network failures
 *  - Structured error messages
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://carinventorymanagement.onrender.com';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}/api${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Remove Content-Type for requests without body
  if (!config.body) {
    delete config.headers['Content-Type'];
  }

  try {
    const response = await fetch(url, config);

    // Handle no-content responses (204)
    if (response.status === 204) return null;

    // Handle Render sleep / gateway errors
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error(
        'Không thể kết nối tới server. Backend trên Render có thể đang khởi động (cold start) hoặc tạm thời unavailable. Vui lòng thử lại sau 30–60 giây.'
      );
    }

    // Parse response body
    const contentType = response.headers.get('content-type') || '';
    let data;

    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Throw on error status codes
    if (!response.ok) {
      let errorMessage;
      if (typeof data === 'string' && data.length > 0) {
        errorMessage = data;
      } else if (data && typeof data === 'object') {
        errorMessage = data.message || data.title || data.detail || JSON.stringify(data);
      } else {
        errorMessage = `Lỗi HTTP ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Network / CORS / DNS failures
    if (error instanceof TypeError && error.message.toLowerCase().includes('fetch')) {
      throw new Error(
        'Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau.'
      );
    }
    throw error;
  }
}

const api = {
  get: (endpoint) => request(endpoint),

  post: (endpoint, body) =>
    request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (endpoint, body) =>
    request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: (endpoint, body) =>
    request(endpoint, {
      method: 'PATCH',
      ...(body ? { body: JSON.stringify(body) } : {}),
    }),

  delete: (endpoint) =>
    request(endpoint, { method: 'DELETE' }),
};

export default api;
