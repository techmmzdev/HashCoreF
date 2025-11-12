/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  FileText,
  Calendar,
  TrendingUp,
  Loader2,
  Clock,
  CheckCircle,
  Eye,
} from "lucide-react";
import { clientDashboardService } from "@/services/clientDashboard";
import { ClientDashboardSkeleton } from "../../components/common/Skeleton";

// Componente optimizado para cards de estadísticas
const StatCard = memo(
  ({ icon: IconComponent, label, value, bgColor, iconColor }) => {
    return (
      <div className="bg-white rounded-lg shadow p-3 sm:p-4 md:p-6 hover:shadow-lg transition-shadow">
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
          <div className="flex-1">
            <p className="text-xs sm:text-sm text-gray-600">
              {label}
            </p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1 sm:mt-2">
              {value || 0}
            </p>
          </div>
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 ${bgColor} rounded-lg flex items-center justify-center shrink-0`}
          >
            <IconComponent className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
          </div>
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

// Componente optimizado para items de actividad
const ActivityItem = memo(({ item, formatTimeAgo }) => (
  <div className="flex items-center space-x-2 sm:space-x-3">
    <div className={`w-2 h-2 ${item.color} rounded-full shrink-0`}></div>
    <div className="flex-1 min-w-0">
      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
        {item.action}
      </p>
      <p className="text-xs text-gray-500">
        {formatTimeAgo(item.time)}
      </p>
    </div>
  </div>
));

ActivityItem.displayName = "ActivityItem";

function ClientDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return; // 🛑 evita peticiones si ya no hay usuario logueado
    loadDashboardData();
  }, [user]);

  const loadDashboardData = useCallback(async () => {
    if (!user?.clientId) {
      setError("No se encontró información del cliente");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [statsData, activityData] = await Promise.all([
        clientDashboardService.getClientStats(user.clientId),
        clientDashboardService.getRecentActivity(user.clientId),
      ]);

      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setError("Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  }, [user?.clientId]);

  // Helper optimizado para formatear tiempo relativo
  const formatTimeAgo = useCallback((date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Justo ahora";
    if (diffMins < 60)
      return `Hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    if (diffHours < 24)
      return `Hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    return `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
  }, []);

  // Configuración de estadísticas memoizada
  const statsConfig = useMemo(
    () => [
      {
        key: "totalPublications",
        label: "Mis Publicaciones",
        icon: FileText,
        color: "amber",
        bgColor: "bg-amber-100",
        iconColor: "text-amber-700",
      },
      {
        key: "publishedPublications",
        label: "Editadas",
        icon: CheckCircle,
        color: "green",
        bgColor: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        key: "scheduledPublications",
        label: "Programadas",
        icon: Clock,
        color: "blue",
        bgColor: "bg-blue-100",
        iconColor: "text-blue-600",
      },
    ],
    []
  );

  if (loading) {
    return <ClientDashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={loadDashboardData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          ¡Hola, {user?.name}! 👋
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Bienvenido a tu panel de gestión
        </p>
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium">
            Plan: {user?.plan || "BASIC"}
          </span>
          {user?.companyName && (
            <span className="text-gray-600">
              {user.companyName}
            </span>
          )}
        </div>
      </div>

      {/* Stats Grid optimizado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {statsConfig.map((config) => (
          <StatCard
            key={config.key}
            icon={config.icon}
            label={config.label}
            value={stats?.[config.key]}
            bgColor={config.bgColor}
            iconColor={config.iconColor}
          />
        ))}
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          Actividad Reciente
        </h3>
        {recentActivity.length > 0 ? (
          <div className="space-y-3 sm:space-y-4 max-h-[250px] sm:max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {recentActivity.map((item, idx) => (
              <ActivityItem
                key={`${item.time}-${idx}`}
                item={item}
                formatTimeAgo={formatTimeAgo}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[150px] sm:h-[200px]">
            <p className="text-xs sm:text-sm text-gray-500">
              No hay actividad reciente
            </p>
          </div>
        )}
      </div>

      {/* Panel de Estadísticas Adicionales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">
            Estado de Publicaciones
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 sm:gap-2">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" />
                Editadas
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {stats?.publishedPublications || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 sm:gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                Programadas
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {stats?.scheduledPublications || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1.5 sm:gap-2">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                En Proceso
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {stats?.draftPublications || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
          <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">
            Mi Plan
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">
                Plan Actual
              </span>
              <span className="text-xs sm:text-sm font-semibold text-amber-700">
                {user?.plan || "BASIC"}
              </span>
            </div>
            {stats?.myInfo && (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">
                    Estado
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      stats.myInfo.status
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats.myInfo.status ? "Activo" : "Inactivo"}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg sm:col-span-2 md:col-span-1">
          <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-3">
            Resumen
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">
                Total Publicaciones
              </span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                {stats?.totalPublications || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">
                Activas este Mes
              </span>
              <span className="text-xs sm:text-sm font-semibold text-blue-600">
                {stats?.publishedPublications || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(ClientDashboard);
