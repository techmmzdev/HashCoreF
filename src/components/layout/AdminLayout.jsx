import { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Users,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BaseSidebar, MobileHeader } from "./shared";

const NAVIGATION_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Clientes", href: "/admin/clients", icon: Users },
  { name: "Administradores", href: "/admin/users", icon: User },
  { name: "Reportes", href: "/admin/reports", icon: BarChart3 },
  { name: "Calendario", href: "/admin/calendar", icon: Calendar },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Eliminado pendingPublicationsCount

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [sidebarOpen]);

  // Cerrar sidebar cuando cambie la ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header móvil fijo cuando sidebar está cerrado */}
      <div className={`${sidebarOpen ? "" : "sticky top-0 z-40"}`}>
        <MobileHeader
          onOpenSidebar={() => setSidebarOpen(true)}
          userType="admin"
        />
      </div>

      {/* Sidebar escritorio */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col grow sidebar-admin-gradient shadow-2xl">
          <BaseSidebar
            navigation={NAVIGATION_ITEMS}
            user={user}
            onLogout={handleLogout}
            onCloseSidebar={() => setSidebarOpen(false)}
            userType="admin"
          />
        </div>
      </div>

      {/* Sidebar móvil */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 flex flex-col w-full max-w-xs sidebar-admin-gradient transform transition-transform duration-300 ease-in-out z-50 shadow-2xl">
            <BaseSidebar
              navigation={NAVIGATION_ITEMS}
              user={user}
              onLogout={handleLogout}
              onCloseSidebar={() => setSidebarOpen(false)}
              isMobile={true}
              userType="admin"
            />
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
