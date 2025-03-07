import {
  apiClient,
  setupAuthInterceptor,
  setupResponseInterceptor,
} from "./api";

const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User credentials
   * @returns {Promise<Object>} User data and token
   */
  async login(credentials) {
    try {
      const response = await apiClient.post("/users/login", credentials);
      const { token, user } = response.data.response;
      return { token, userData: user };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Set up axios interceptors for authentication
   * @param {string} token - JWT token
   * @param {Function} logoutCallback - Function to call on auth failure
   */
  setupAxiosInterceptors(token, logoutCallback) {
    setupAuthInterceptor(token);
    setupResponseInterceptor(logoutCallback);
  },
};

export default authService;
