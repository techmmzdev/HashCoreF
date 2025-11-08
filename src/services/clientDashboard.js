// frontend/src/services/clientDashboard.js
import api from "./api";

/**
 * Servicio para obtener datos del dashboard de cliente
 */
export const clientDashboardService = {
  getClientStats: async (clientId) => {
    try {
      const [myInfoRes, publicationsRes, statsRes, calendarRes, upcomingRes] =
        await Promise.all([
          api.get("/clients/me"),
          api.get("/publications/my"), // ✅ Cambio: usar ruta de cliente
          api.get(`/publications/stats/${clientId}`),
          api.get("/calendar/my-notes"),
          api.get("/calendar/upcoming?days=7"),
        ]);

      const myInfo = myInfoRes.data;
      const publications = Array.isArray(publicationsRes.data)
        ? publicationsRes.data
        : [];
      const stats = statsRes.data || {};
      const calendarNotes = Array.isArray(calendarRes.data)
        ? calendarRes.data
        : Array.isArray(calendarRes.data?.calendarNotes)
        ? calendarRes.data.calendarNotes
        : [];
      const upcomingEvents = Array.isArray(upcomingRes.data)
        ? upcomingRes.data
        : Array.isArray(upcomingRes.data?.events)
        ? upcomingRes.data.events
        : [];

      // Contar por estado de publicaciones
      const totalPublications = publications.length;
      const publishedPublications = publications.filter(
        (p) => p.status === "PUBLISHED"
      ).length;
      const draftPublications = publications.filter(
        (p) => p.status === "DRAFT"
      ).length;
      const scheduledPublications = publications.filter(
        (p) => p.status === "SCHEDULED"
      ).length;

      // Eventos del mes actual
      const now = new Date();
      const currentMonthEvents = calendarNotes.filter((note) => {
        const noteDate = new Date(note.event_date || note.note_date);
        return (
          noteDate.getMonth() === now.getMonth() &&
          noteDate.getFullYear() === now.getFullYear()
        );
      }).length;

      // Próximos eventos (7 días)
      const upcomingEventsCount = upcomingEvents.length;

      return {
        myInfo,
        totalPublications,
        publishedPublications,
        draftPublications,
        scheduledPublications,
        currentMonthEvents,
        upcomingEventsCount,
        publications,
        calendarNotes,
        upcomingEvents,
        stats,
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas del cliente:", error);
      throw error;
    }
  },

  getRecentPublications: async () => {
    try {
      const response = await api.get("/publications/my"); // ✅ Cambio: usar ruta de cliente
      const publications = Array.isArray(response.data) ? response.data : [];

      // Ordenar por fecha y tomar las últimas 5
      return publications
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);
    } catch (error) {
      console.error("Error obteniendo publicaciones recientes:", error);
      return [];
    }
  },

  /**
   * Obtener eventos próximos
   */
  getUpcomingEvents: async () => {
    try {
      const response = await api.get("/calendar/upcoming?days=7");
      const events = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.events)
        ? response.data.events
        : [];

      return events.slice(0, 5);
    } catch (error) {
      console.error("Error obteniendo eventos próximos:", error);
      return [];
    }
  },

  getRecentActivity: async () => {
    try {
      const [publicationsRes, calendarRes] = await Promise.all([
        api.get("/publications/my"), // ✅ Cambio: usar ruta de cliente
        api.get("/calendar/my-notes"),
      ]);

      const publications = Array.isArray(publicationsRes.data)
        ? publicationsRes.data
        : [];
      const calendarNotes = Array.isArray(calendarRes.data)
        ? calendarRes.data
        : Array.isArray(calendarRes.data?.calendarNotes)
        ? calendarRes.data.calendarNotes
        : [];

      const activities = [];

      // Últimas 3 publicaciones
      publications
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .forEach((pub) => {
          activities.push({
            type: "publication",
            action: `Publicación ${
              pub.status === "PUBLISHED"
                ? "editada"
                : pub.status === "SCHEDULED"
                ? "programada"
                : "en proceso"
            }: ${pub.title || "Sin título"}`,
            time: pub.created_at,
            color:
              pub.status === "PUBLISHED"
                ? "bg-green-500"
                : pub.status === "SCHEDULED"
                ? "bg-yellow-500"
                : "bg-gray-500",
          });
        });

      // Últimos 3 eventos
      calendarNotes
        .filter((note) => note.is_event)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 3)
        .forEach((event) => {
          activities.push({
            type: "event",
            action: `Evento: ${event.title || "Sin título"}`,
            time: event.created_at,
            color: "bg-purple-500",
          });
        });

      // Ordenar por fecha y tomar las últimas 5
      return activities
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 5);
    } catch (error) {
      console.error("Error obteniendo actividad reciente:", error);
      return [];
    }
  },
};

export default clientDashboardService;
