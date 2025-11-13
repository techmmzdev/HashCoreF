import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  FileText,
  Activity,
  Calendar as CalendarIcon,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { dashboardService } from "@/services/dashboard";
import { useAuth } from "@/context/AuthContext";
import { AdminDashboardSkeleton } from "../../components/common/Skeleton";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899"];

const StatCard = ({ title, items }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <span className={`text-sm ${item.textColor || "text-gray-600"}`}>
            {item.label}
          </span>
          <span
            className={`text-sm font-semibold ${
              item.valueColor || "text-gray-900"
            }`}
          >
            {item.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Justo ahora";
  if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
  if (diffHours < 24)
    return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
  return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
};

const AdminDashboard = () => {
  const { user } = useAuth();

  // React Query para dashboard
  const {
    data,
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminDashboard", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const [statsData, monthlyDataRes, activityData] = await Promise.all([
        dashboardService.getAdminStats(),
        dashboardService.getMonthlyData(),
        dashboardService.getRecentActivity(),
      ]);
      // Combinar datos mensuales para el gráfico
      const combined = monthlyDataRes.monthlyPublications.map((pub, idx) => ({
        mes: pub.mes,
        publicaciones: pub.value,
        usuarios: monthlyDataRes.monthlyUsers[idx]?.value || 0,
      }));
      return {
        stats: statsData,
        monthlyData: combined,
        recentActivity: activityData,
      };
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  });

  const stats = data?.stats || null;
  const monthlyData = data?.monthlyData || [];
  const recentActivity = data?.recentActivity || [];

  const chartTheme = useMemo(
    () => ({
      axisColor: "#374151",
      gridStroke: "#e5e7eb",
      tooltipStyle: {
        backgroundColor: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: "4px",
      },
    }),
    []
  );

  // Eliminado: función y efecto de carga manual, ahora todo lo maneja React Query

  const planDistribution = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "BASIC", value: stats.basicPlan },
      { name: "STANDARD", value: stats.standardPlan },
      { name: "FULL", value: stats.fullPlan },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const statsCards = useMemo(() => {
    if (!stats) return [];
    return [
      {
        name: "Total Clientes",
        value: stats.totalClients,
        subtitle: `${stats.activeClients} activos`,
        icon: Users,
        color: "bg-blue-500",
        textColor: "text-blue-600",
      },
      {
        name: "Publicaciones",
        value: stats.totalPublications,
        subtitle: `${stats.publishedPublications} editadas`,
        icon: FileText,
        color: "bg-green-500",
        textColor: "text-green-600",
      },
      {
        name: "Eventos del Mes",
        value: stats.currentMonthEvents,
        subtitle: "En calendario",
        icon: CalendarIcon,
        color: "bg-purple-500",
        textColor: "text-purple-600",
      },
      {
        name: "Total Usuarios",
        value: stats.totalUsers,
        subtitle: `${stats.totalClients} clientes`,
        icon: Activity,
        color: "bg-orange-500",
        textColor: "text-orange-600",
      },
    ];
  }, [stats]);

  const additionalStats = useMemo(() => {
    if (!stats) return [];
    return [
      {
        title: "Estado de Publicaciones",
        items: [
          { label: "Programadas", value: stats.scheduledPublications || 0 },
          { label: "Editadas", value: stats.publishedPublications || 0 },
        ],
      },
      {
        title: "Distribución de Planes",
        items: [
          { label: "Plan BASIC", value: stats.basicPlan || 0 },
          { label: "Plan STANDARD", value: stats.standardPlan || 0 },
          { label: "Plan FULL", value: stats.fullPlan || 0 },
        ],
      },
      {
        title: "Estado de Clientes",
        items: [
          {
            label: "Clientes Activos",
            value: stats.activeClients || 0,
            valueColor: "text-green-600",
          },
          {
            label: "Clientes Inactivos",
            value: (stats.totalClients || 0) - (stats.activeClients || 0),
            valueColor: "text-red-600",
          },
          { label: "Total", value: stats.totalClients || 0 },
        ],
      },
    ];
  }, [stats]);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            {error?.message || "Error al cargar los datos del dashboard"}
          </p>
          <button
            onClick={refetch}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`shrink-0 ${stat.color} rounded-md p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                      </dd>
                      <dd className="mt-1">
                        <div
                          className={`text-xs font-medium ${stat.textColor}`}
                        >
                          {stat.subtitle}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart - Publicaciones y Usuarios */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Publicaciones y Usuarios (Últimos 6 meses)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartTheme.gridStroke}
              />
              <XAxis
                dataKey="mes"
                stroke={chartTheme.axisColor}
                tick={{ fill: chartTheme.axisColor }}
              />
              <YAxis
                stroke={chartTheme.axisColor}
                tick={{ fill: chartTheme.axisColor }}
              />
              <Tooltip
                contentStyle={chartTheme.tooltipStyle}
                labelStyle={{ color: chartTheme.axisColor }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="publicaciones"
                stroke="#6366f1"
                strokeWidth={2}
                name="Publicaciones"
              />
              <Line
                type="monotone"
                dataKey="usuarios"
                stroke="#8b5cf6"
                strokeWidth={2}
                name="Usuarios"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Comparativa */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Comparativa Mensual
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartTheme.gridStroke}
              />
              <XAxis
                dataKey="mes"
                stroke={chartTheme.axisColor}
                tick={{ fill: chartTheme.axisColor }}
              />
              <YAxis
                stroke={chartTheme.axisColor}
                tick={{ fill: chartTheme.axisColor }}
              />
              <Tooltip
                contentStyle={chartTheme.tooltipStyle}
                labelStyle={{ color: chartTheme.axisColor }}
              />
              <Legend />
              <Bar
                dataKey="publicaciones"
                fill="#6366f1"
                name="Publicaciones"
              />
              <Bar dataKey="usuarios" fill="#ec4899" name="Usuarios" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Distribución de Planes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Distribución por Plan
          </h3>
          {planDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {planDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={chartTheme.tooltipStyle}
                  labelStyle={{ color: chartTheme.axisColor }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">
                No hay datos de planes disponibles
              </p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Actividad Reciente
          </h3>
          {recentActivity.length > 0 ? (
            <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
              {recentActivity.map((item, idx) => (
                <div
                  key={`${item.time}-${idx}`}
                  className="flex items-center space-x-3"
                >
                  <div
                    className={`w-2 h-2 ${item.color} rounded-full shrink-0`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.action}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(item.time)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px]">
              <p className="text-gray-500">No hay actividad reciente</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {additionalStats.map((section, index) => (
          <StatCard key={index} title={section.title} items={section.items} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
