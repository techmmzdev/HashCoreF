// frontend/src/utils/authUtils.js
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const payload = jwtDecode(token);

    // Verificación de expiración
    if (payload.exp * 1000 < Date.now()) {
      // Token expirado
      console.warn("Token expirado");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }

    // Retorna la información del usuario del token
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      clientId: payload.clientId || null,
      companyName: payload.companyName || null,
      plan: payload.plan || null,
    };
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payload = jwtDecode(token);
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const getTokenTimeRemaining = (token) => {
  if (!token) return 0;

  try {
    const payload = jwtDecode(token);
    const expirationTime = payload.exp * 1000;
    const currentTime = Date.now();
    const remaining = Math.floor((expirationTime - currentTime) / 1000);

    return remaining > 0 ? remaining : 0;
  } catch {
    return 0;
  }
};
