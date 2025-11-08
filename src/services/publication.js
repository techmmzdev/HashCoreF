// frontend/src/services/publication.js
import apiClient from "./api.js";

export const publicationService = {
  // =================== RUTAS PARA ADMIN ===================

  // Obtener TODAS las publicaciones (SOLO ADMIN) - Ruta: GET /api/publications
  async getAllPublications() {
    try {
      const response = await apiClient.get("/publications");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear publicación para un cliente (SOLO ADMIN) - Ruta: POST /api/publications/client/:clientId
  async createPublication(clientId, publicationData) {
    try {
      const response = await apiClient.post(
        `/publications/client/${clientId}`,
        publicationData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar publicación (SOLO ADMIN) - Ruta: PUT /api/publications/:id
  async updatePublication(publicationId, updateData) {
    try {
      const response = await apiClient.put(
        `/publications/${publicationId}`,
        updateData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar solo el estado de una publicación (SOLO ADMIN) - Ruta: PATCH /api/publications/:id/status
  async updatePublicationStatus(publicationId, status) {
    try {
      const response = await apiClient.patch(
        `/publications/${publicationId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar publicación (SOLO ADMIN) - Ruta: DELETE /api/publications/:id
  async deletePublication(publicationId) {
    try {
      const response = await apiClient.delete(`/publications/${publicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // =================== RUTAS PARA CLIENTE ===================

  // Obtener mis publicaciones (SOLO CLIENTE) - Ruta: GET /api/publications/my
  async getMyPublications() {
    try {
      const response = await apiClient.get("/publications/my");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // =================== RUTAS COMPARTIDAS (ADMIN/CLIENTE) ===================

  // Obtener publicaciones de un cliente específico - Ruta: GET /api/publications/client/:clientId
  async getPublicationsByClient(clientId) {
    try {
      const response = await apiClient.get(`/publications/client/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener una publicación específica - Ruta: GET /api/publications/:id
  async getPublicationById(publicationId) {
    try {
      const response = await apiClient.get(`/publications/${publicationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener estadísticas de publicaciones - Ruta: GET /api/publications/stats/:clientId
  async getPublicationStats(clientId) {
    try {
      const response = await apiClient.get(`/publications/stats/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default publicationService;
