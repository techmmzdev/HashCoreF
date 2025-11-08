// frontend/src/services/media.js
import apiClient from "./api.js";

export const mediaService = {
  // =================== GESTIÓN DE MULTIMEDIA ===================

  // Subir material multimedia (SOLO ADMIN) - Ruta: POST /api/media/publications/:publicationId
  async uploadMedia(publicationId, mediaFile, publishNow = false) {
    try {
      const formData = new FormData();
      formData.append("mediaFile", mediaFile);

      const url = `/media/publications/${publicationId}${
        publishNow ? "?publishNow=true" : ""
      }`;

      const response = await apiClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Subir múltiples archivos multimedia (SOLO ADMIN)
  async uploadMultipleMedia(publicationId, files, publishNow = false) {
    try {
      const formData = new FormData();

      // Agregar cada archivo al FormData
      files.forEach((file) => {
        formData.append("mediaFile", file);
      });

      const url = `/media/publications/${publicationId}${
        publishNow ? "?publishNow=true" : ""
      }`;

      const response = await apiClient.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener material multimedia de una publicación - Ruta: GET /api/media/publications/:publicationId
  async getMedia(publicationId) {
    try {
      const response = await apiClient.get(
        `/media/publications/${publicationId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener estadísticas de multimedia - Ruta: GET /api/media/publications/:publicationId/stats
  async getMediaStats(publicationId) {
    try {
      const response = await apiClient.get(
        `/media/publications/${publicationId}/stats`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar material multimedia específico (SOLO ADMIN) - Ruta: DELETE /api/media/publications/:publicationId/media/:mediaId
  async deleteMedia(publicationId, mediaId) {
    try {
      const response = await apiClient.delete(
        `/media/publications/${publicationId}/media/${mediaId}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default mediaService;
