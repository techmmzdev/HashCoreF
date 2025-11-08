import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, FileText, User, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BaseSidebar, MobileHeader } from "./shared";

// Navegación específica del cliente
const CLIENT_NAVIGATION = [
  { name: "Dashboard", href: "/client", icon: LayoutDashboard },
  { name: "Publicaciones", href: "/client/publications", icon: FileText },
  { name: "Mi Perfil", href: "/client/profile", icon: User },
];

const ClientLayout = () => {
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadNotifications] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();

  // Funciones optimizadas con useCallback
  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const handleCloseSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => {
    setSidebarOpen(true);
  }, []);

  // Desactivar scroll en body cuando el sidebar móvil esté abierto
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  // Cerrar sidebar cuando se cambie de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // TODO: Socket.IO listener - Descomentar cuando se implemente WebSocket
  // useEffect(() => {
  //   if (!socket) return;
  //   const handleNewClientNotification = (data) => {
  //     console.log("[ClientLayout] Notificación recibida:", data);
  //     setUnreadNotifications((prev) => prev + 1);
  //   };
  //   socket.on("client_new_notification", handleNewClientNotification);
  //   return () => socket.off("client_new_notification", handleNewClientNotification);
  // }, [socket]);

  // Pantalla de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            Cargando datos del cliente...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header móvil usando componente compartido */}
      <MobileHeader
        onOpenSidebar={handleOpenSidebar}
        title="HASHTAGPE"
        notificationCount={unreadNotifications}
        notificationLink="/client/comments"
        userType="client"
      />

      {/* Sidebar escritorio */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col grow bg-linear-to-b from-indigo-600 via-indigo-700 to-indigo-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 shadow-2xl">
          <BaseSidebar
            title="HASHTAGPE"
            navigation={CLIENT_NAVIGATION}
            user={user}
            onLogout={handleLogout}
            onCloseSidebar={handleCloseSidebar}
            userType="client"
          />
        </div>
      </div>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={handleCloseSidebar}
            aria-hidden="true"
          />
          <div
            className={`fixed inset-y-0 left-0 flex flex-col w-full max-w-xs bg-linear-to-b from-indigo-600 via-indigo-700 to-indigo-900 dark:from-gray-800 dark:via-gray-900 dark:to-gray-900 transform transition-transform duration-300 ease-in-out z-50 shadow-2xl ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <BaseSidebar
              title="HASHTAGPE"
              navigation={CLIENT_NAVIGATION}
              user={user}
              onLogout={handleLogout}
              onCloseSidebar={handleCloseSidebar}
              isMobile
              userType="client"
            />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClientLayout;
