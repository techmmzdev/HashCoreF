import axios from "axios";

// Configuración base de axios
const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejo de errores de autenticación
    if (error.response?.status === 401) {
      // Token inválido o expirado
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      // Solo redirigir si no estamos ya en login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Manejo de errores de permisos
    if (error.response?.status === 403) {
      console.error("Acceso denegado:", error.response.data?.message);
    }

    // Manejo de errores de servidor
    if (error.response?.status >= 500) {
      console.error("Error del servidor:", error.response.data?.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
