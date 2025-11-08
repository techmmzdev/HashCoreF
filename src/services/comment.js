// frontend/src/services/comment.js
import apiClient from "./api.js";

export const commentService = {
  // =================== GESTIÓN DE COMENTARIOS ===================

  // Crear comentario en una publicación - Ruta: POST /api/comments/publications/:publicationId
  async createComment(publicationId, commentData) {
    try {
      const response = await apiClient.post(
        `/comments/publications/${publicationId}`,
        commentData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener comentarios de una publicación - Ruta: GET /api/comments/publications/:publicationId
  async getComments(publicationId) {
    try {
      const response = await apiClient.get(
        `/comments/publications/${publicationId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener estadísticas de comentarios - Ruta: GET /api/comments/publications/:publicationId/stats
  async getCommentStats(publicationId) {
    try {
      const response = await apiClient.get(
        `/comments/publications/${publicationId}/stats`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar comentario (SOLO ADMIN) - Ruta: DELETE /api/comments/publications/:publicationId/comments/:commentId
  async deleteComment(publicationId, commentId) {
    try {
      const response = await apiClient.delete(
        `/comments/publications/${publicationId}/comments/${commentId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default commentService;
