// frontend/src/services/index.js
export { default as apiClient } from "./api.js";
export { authService } from "./auth.js";
export { userService } from "./user.js";
export { clientService } from "./client.js";
export { calendarService } from "./calendar.js";
export { publicationService } from "./publication.js";
export { mediaService } from "./media.js";
export { commentService } from "./comment.js";

// Exportación individual para importación directa
export { default as api } from "./api.js";
