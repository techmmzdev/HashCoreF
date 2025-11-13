// frontend/src/services/dashboard.js
import api from "./api";

/**
 * Servicio para obtener estadísticas del dashboard de administrador
 */
export const dashboardService = {
  /**
   * Obtener estadísticas generales del dashboard
   */
  getAdminStats: async () => {
    try {
      const [usersRes, clientsRes, publicationsRes, calendarRes] =
        await Promise.all([
          api.get("/users"),
          api.get("/clients"),
          api.get("/publications"),
          api.get("/calendar/admin/all"),
        ]);

      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const clients = Array.isArray(clientsRes.data) ? clientsRes.data : [];
      const publications = Array.isArray(publicationsRes.data)
        ? publicationsRes.data
        : [];

      // El endpoint de calendar retorna un objeto con una propiedad 'calendarNotes'
      const calendarNotes = Array.isArray(calendarRes.data)
        ? calendarRes.data
        : Array.isArray(calendarRes.data?.calendarNotes)
        ? calendarRes.data.calendarNotes
        : [];

      // Calcular estadísticas
      const totalUsers = users.length;
      const totalClients = clients.length;
      const totalPublications = publications.length;

      const scheduledPublications = publications.filter(
        (p) => p.status === "SCHEDULED"
      ).length;
      const publishedPublications = publications.filter(
        (p) => p.status === "PUBLISHED"
      ).length;

      // Contar por planes
      const basicPlan = clients.filter((c) => c.plan === "BASIC").length;
      const standardPlan = clients.filter((c) => c.plan === "STANDARD").length;
      const fullPlan = clients.filter((c) => c.plan === "FULL").length;

      // Clientes activos
      const activeClients = clients.filter((c) => c.status === true).length;

      // Eventos del mes actual
      const now = new Date();
      const currentMonthEvents = calendarNotes.filter((note) => {
        const noteDate = new Date(note.event_date);
        return (
          noteDate.getMonth() === now.getMonth() &&
          noteDate.getFullYear() === now.getFullYear()
        );
      }).length;

      return {
        totalUsers,
        totalClients,
        totalPublications,
        activeClients,
        scheduledPublications,
        publishedPublications,
        basicPlan,
        standardPlan,
        fullPlan,
        currentMonthEvents,
        users,
        clients,
        publications,
        calendarNotes,
      };
    } catch (error) {
      console.error("Error obteniendo estadísticas:", error);
      throw error;
    }
  },

  /**
   * Obtener datos para gráficos mensuales
   */
  getMonthlyData: async () => {
    try {
      const [publicationsRes, usersRes] = await Promise.all([
        api.get("/publications"),
        api.get("/users"),
      ]);

      const publications = publicationsRes.data;
      const users = usersRes.data;

      // Agrupar publicaciones por mes (últimos 6 meses)
      const monthlyPublications = getLastSixMonthsData(
        publications,
        "created_at"
      );
      const monthlyUsers = getLastSixMonthsData(users, "created_at");

      return {
        monthlyPublications,
        monthlyUsers,
      };
    } catch (error) {
      console.error("Error obteniendo datos mensuales:", error);
      throw error;
    }
  },

  /**
   * Obtener actividad reciente
   * Nota: Los comentarios NO tienen endpoint general, solo por publicación
   * Por ahora solo mostramos publicaciones y usuarios
   */
  getRecentActivity: async () => {
    try {
      const [publicationsRes, usersRes, calendarRes] = await Promise.all([
        api.get("/publications"),
        api.get("/users"),
        api.get("/calendar/admin/all"),
      ]);

      const publications = Array.isArray(publicationsRes.data)
        ? publicationsRes.data
        : [];
      const users = Array.isArray(usersRes.data) ? usersRes.data : [];
      const calendarNotes = Array.isArray(calendarRes.data)
        ? calendarRes.data
        : Array.isArray(calendarRes.data?.calendarNotes)
        ? calendarRes.data.calendarNotes
        : [];

      // Combinar y ordenar por fecha
      const activities = [];

      // Últimas 5 publicaciones
      publications
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .forEach((pub) => {
          activities.push({
            type: "publication",
            action: `Nueva publicación: ${pub.title || "Sin título"}`,
            time: pub.created_at,
            color: "bg-blue-500",
          });
        });

      // Últimos 5 usuarios
      users
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .forEach((user) => {
          activities.push({
            type: "user",
            action: `Nuevo usuario: ${user.name}`,
            time: user.created_at,
            color: "bg-green-500",
          });
        });

      // Últimos 5 eventos de calendario
      calendarNotes
        .filter((note) => note.is_event) // Solo eventos
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .forEach((event) => {
          activities.push({
            type: "event",
            action: `Nuevo evento: ${event.title || "Sin título"}`,
            time: event.created_at,
            color: "bg-purple-500",
          });
        });

      // Ordenar todo por fecha y tomar los últimos 10
      return activities
        .sort((a, b) => new Date(b.time) - new Date(a.time))
        .slice(0, 10);
    } catch (error) {
      console.error("Error obteniendo actividad reciente:", error);
      return [];
    }
  },
};

/**
 * Helper: Obtener datos de los últimos 6 meses
 */
function getLastSixMonthsData(items, dateField) {
  const months = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];
  const now = new Date();
  const data = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = months[date.getMonth()];

    const count = items.filter((item) => {
      const itemDate = new Date(item[dateField]);
      return (
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    }).length;

    data.push({
      mes: monthName,
      value: count,
    });
  }

  return data;
}

export default dashboardService;
