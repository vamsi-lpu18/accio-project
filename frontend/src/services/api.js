const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('accio-token') : null;
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accio-token', token);
      // Dispatch custom event to notify components about auth state change
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isLoggedIn: true } }));
    }
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accio-token');
      // Dispatch custom event to notify components about auth state change
      window.dispatchEvent(new CustomEvent('authStateChanged', { detail: { isLoggedIn: false } }));
    }
  }

  // Get headers for API requests
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle cases where response might not be JSON
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn('Response is not JSON:', response.status, response.statusText);
        data = { error: 'Invalid response format' };
      }

      if (!response.ok) {
        throw new Error(data.error || `API request failed: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      // Return a default response instead of throwing to prevent crashes
      return { error: error.message, sessions: [], chat: [] };
    }
  }

  // Authentication methods
  async signup(userData) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updatePreferences(preferences) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // Session methods
  async getSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/sessions?${queryString}`);
  }

  async getSession(id) {
    return this.request(`/sessions/${id}`);
  }

  async createSession(sessionData) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(id, sessionData) {
    return this.request(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(id) {
    return this.request(`/sessions/${id}`, {
      method: 'DELETE',
    });
  }

  async duplicateSession(id) {
    return this.request(`/sessions/${id}/duplicate`, {
      method: 'POST',
    });
  }

  async getPublicSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/sessions/public?${queryString}`);
  }

  // AI methods
  async generateComponent(prompt, codeType = 'jsx') {
    return this.request('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, codeType }),
    });
  }

  async refineComponent(prompt, existingCode, codeType = 'jsx') {
    return this.request('/ai/refine', {
      method: 'POST',
      body: JSON.stringify({ prompt, existingCode, codeType }),
    });
  }

  async chatWithAI(message, context = null) {
    return this.request('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async getAIStatus() {
    return this.request('/ai/status');
  }

  // Health check
  async healthCheck() {
    // Health endpoint is at root level, not under /api
    const url = `${this.baseURL.replace('/api', '')}/health`;
    const config = {
      headers: this.getHeaders(),
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Health check failed');
      }

      return data;
    } catch (error) {
      console.error('Health Check Error:', error);
      throw error;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService; 