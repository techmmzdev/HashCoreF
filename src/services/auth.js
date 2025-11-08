import apiClient from "./api.js";

export const authService = {
  // Login - Ruta: POST /api/auth/login
  async login(email, password) {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout - Ruta: POST /api/auth/logout
  async logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Verificar token - Ruta: GET /api/auth/verify
  async verifyToken() {
    try {
      const response = await apiClient.get("/auth/verify");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refrescar token - Ruta: POST /api/auth/refresh
  async refreshToken() {
    try {
      const response = await apiClient.post("/auth/refresh");

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener usuario actual del localStorage
  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // Verificar si está autenticado
  isAuthenticated() {
    return !!localStorage.getItem("token");
  },
};
