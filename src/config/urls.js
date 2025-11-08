/**
 * Configuración centralizada de URLs
 * Previene problemas de URLs hardcodeadas
 */

// Obtener la URL base de la API
export const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL;

  // Validación en producción
  if (import.meta.env.PROD && (!url || url.includes("localhost"))) {
    console.error(
      "⚠️ ADVERTENCIA: VITE_API_URL no está configurada correctamente para producción"
    );
    console.error(
      "Por favor configura VITE_API_URL en el archivo .env.production"
    );
  }

  return url;
};

// Obtener la URL de uploads
export const getUploadsUrl = () => {
  const url = import.meta.env.VITE_UPLOADS_URL;

  // Validación en producción
  if (import.meta.env.PROD && (!url || url.includes("localhost"))) {
    console.error(
      "⚠️ ADVERTENCIA: VITE_UPLOADS_URL no está configurada correctamente para producción"
    );
  }

  return url;
};

// Obtener la URL de sockets
export const getSocketUrl = () => {
  const url = import.meta.env.VITE_SOCKET_URL;

  // Validación en producción
  if (import.meta.env.PROD && (!url || url.includes("localhost"))) {
    console.error(
      "⚠️ ADVERTENCIA: VITE_SOCKET_URL no está configurada correctamente para producción"
    );
  }

  return url;
};

// Helper para construir URLs de media
export const getMediaUrl = (path) => {
  if (!path) return null;

  // Si la URL ya es completa (Supabase), la devolvemos tal como está
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Si es una ruta relativa (desarrollo local), construir URL local
  const baseUrl = getUploadsUrl().replace(/\/$/, ""); // Remover trailing slash
  const cleanPath = path.replace(/^\//, ""); // Remover leading slash
  return `${baseUrl}/${cleanPath}`;
};

// Verificar si estamos en producción
export const isProduction = () => import.meta.env.PROD;

// Verificar si estamos en desarrollo
export const isDevelopment = () => import.meta.env.DEV;

// Log de configuración (solo en desarrollo)
if (isDevelopment()) {
  console.log("📡 Configuración de URLs:", {
    API: getApiUrl(),
    Uploads: getUploadsUrl(),
    Socket: getSocketUrl(),
    Mode: import.meta.env.MODE,
  });
}
