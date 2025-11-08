import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import AppLogo from "./AppLogo";
import UserProfile from "./UserProfile";

const BaseSidebar = ({
  title,
  navigation,
  user,
  onLogout,
  onCloseSidebar,
  isMobile = false,
  userType = "client",
}) => {
  const location = useLocation();

  // Función para determinar si una ruta está activa
  const isActive = useCallback(
    (href) => {
      if (location.pathname === href) return true;

      // Para rutas base como /admin, ser más específico
      if (href === "/admin") {
        return location.pathname === "/admin";
      }
      if (href === "/client") {
        return location.pathname === "/client";
      }

      return location.pathname.startsWith(href + "/");
    },
    [location.pathname]
  );

  const SidebarHeader = () => (
    <div className="relative h-20 px-6 flex items-center justify-between bg-linear-to-r from-indigo-600 to-indigo-700 dark:from-gray-800 dark:to-gray-900 border-b border-indigo-700 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <AppLogo variant="mobile" />
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>
      {isMobile && (
        <button
          onClick={onCloseSidebar}
          className="p-2 hover:bg-indigo-600 rounded-lg transition-colors text-white"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  const SidebarNavigation = () => (
    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent hover:scrollbar-thumb-indigo-500">
      {navigation.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={isMobile ? onCloseSidebar : undefined}
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
              active
                ? "bg-white/15 text-white shadow-md backdrop-blur-sm border border-white/20"
                : "text-indigo-100 hover:bg-indigo-600 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {active && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-white dark:bg-indigo-400 rounded-r-full"></div>
            )}
            <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="flex-1">{item.name}</span>
            {item.count > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors">
                {item.count}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <SidebarHeader />
      <SidebarNavigation />
      <UserProfile user={user} onLogout={onLogout} userType={userType} />
    </>
  );
};

export default BaseSidebar;
