// frontend/src/services/user.js
import apiClient from "./api.js";

export const userService = {
  // =================== RUTAS DE USUARIOS ===================

  // Crear usuario (SOLO ADMIN) - Ruta: POST /api/users
  async createUser(userData) {
    try {
      const response = await apiClient.post("/users", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear usuario con cliente (SOLO ADMIN) - Ruta: POST /api/users/with-client
  async createUserWithClient(userData) {
    try {
      const response = await apiClient.post("/users/with-client", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener todos los usuarios (SOLO ADMIN) - Ruta: GET /api/users
  async getAllUsers() {
    try {
      const response = await apiClient.get("/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener mi perfil - Ruta: GET /api/users/me
  async getMyProfile() {
    try {
      const response = await apiClient.get("/users/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener usuario por ID - Ruta: GET /api/users/:id
  async getUserById(userId) {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar usuario (básico) - Ruta: PUT /api/users/:id
  async updateUser(userId, updates) {
    try {
      const response = await apiClient.put(`/users/${userId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar usuario con cliente (completo) - Ruta: PUT /api/users/:id/with-client
  async updateUserWithClient(userId, updates) {
    try {
      const response = await apiClient.put(
        `/users/${userId}/with-client`,
        updates
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar usuario (SOLO ADMIN) - Ruta: DELETE /api/users/:id
  async deleteUser(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cambiar mi contraseña - Ruta: PUT /api/users/me/password
  async changeMyPassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.put("/users/me/password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
