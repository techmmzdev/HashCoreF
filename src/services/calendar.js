// frontend/src/services/calendar.js
import apiClient from "./api.js";

export const calendarService = {
  // Obtener mis notas/eventos
  async getMyNotes(filters = {}) {
    try {
      const response = await apiClient.get("/calendar/my-notes", {
        params: filters, // { startDate, endDate, isEvent }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener eventos próximos
  async getUpcomingEvents(days = 7) {
    try {
      const response = await apiClient.get("/calendar/upcoming", {
        params: { days },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener notas de un mes específico
  async getMonthNotes(year, month) {
    try {
      const response = await apiClient.get("/calendar/month", {
        params: { year, month },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener una nota específica
  async getNoteById(id) {
    try {
      const response = await apiClient.get(`/calendar/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear nota/evento
  async createNote(noteData) {
    try {
      const response = await apiClient.post("/calendar", noteData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar nota/evento
  async updateNote(id, updates) {
    try {
      const response = await apiClient.put(`/calendar/${id}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar nota/evento
  async deleteNote(id) {
    try {
      const response = await apiClient.delete(`/calendar/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener todas las notas (SOLO ADMIN)
  async getAllNotes(filters = {}) {
    try {
      const response = await apiClient.get("/calendar/admin/all", {
        params: filters, // { userId, startDate, endDate, isEvent }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default calendarService;
