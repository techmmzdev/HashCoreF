// frontend/src/services/client.js
import apiClient from "./api.js";

export const clientService = {
  // =================== RUTAS DE CLIENTES ===================

  // Obtener mi información como cliente - Ruta: GET /api/clients/me
  async getMyClientInfo() {
    try {
      const response = await apiClient.get("/clients/me");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar mi información como cliente - Ruta: PUT /api/clients/me
  async updateMyClientInfo(updates) {
    try {
      const response = await apiClient.put("/clients/me", updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener todos los clientes (SOLO ADMIN) - Ruta: GET /api/clients
  async getAllClients() {
    try {
      const response = await apiClient.get("/clients");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Crear un nuevo cliente con usuario (SOLO ADMIN) - Ruta: POST /api/users/with-client
  async createClient(data) {
    try {
      const response = await apiClient.post("/users/with-client", {
        email: data.email,
        password: data.password,
        role: "CLIENTE",
        name: data.name,
        company_name: data.company_name,
        plan: data.plan || "BASIC",
        ruc: data.ruc,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener cliente por ID (SOLO ADMIN) - Ruta: GET /api/clients/:clientId
  async getClientById(clientId) {
    try {
      const response = await apiClient.get(`/clients/${clientId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener cliente por user_id - Ruta: GET /api/clients/user/:userId
  async getClientByUserId(userId) {
    try {
      const response = await apiClient.get(`/clients/user/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener publicaciones del cliente (SOLO ADMIN) - Ruta: GET /api/clients/:clientId/publications
  async getClientPublications(clientId) {
    try {
      const response = await apiClient.get(`/clients/${clientId}/publications`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar cliente (SOLO ADMIN) - Ruta: PUT /api/clients/:clientId
  async updateClient(clientId, updates) {
    try {
      const response = await apiClient.put(`/clients/${clientId}`, updates);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cambiar estado del cliente (SOLO ADMIN) - Ruta: PUT /api/clients/:clientId/status
  async toggleClientStatus(clientId) {
    try {
      const response = await apiClient.put(`/clients/${clientId}/status`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar cliente (SOLO ADMIN) - Ruta: DELETE /api/users/:userId
  // Nota: Elimina el USUARIO, lo que elimina en cascada el cliente
  async deleteClient(userId) {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default clientService;
