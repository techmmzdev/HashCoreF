import { useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import AppLogo from "./AppLogo";
import UserProfile from "./UserProfile";

const BaseSidebar = ({
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
    <div
      className={`relative h-20 px-6 flex items-center justify-between border-b ${
        userType === "admin"
          ? "header-admin-gradient border-gray-200"
          : "header-client-gradient border-gray-200"
      }`}
    >
      {userType === "client" ? (
        // Cliente: Texto estilizado con subtítulo
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-black">HASHTAG</span>
            <span className="text-brand-gold">PE</span>
          </h1>
          <p className="text-xs text-indigo-600 tracking-wide mt-0.5">
            Marketing & Publicidad
          </p>
        </div>
      ) : (
        // Admin: Mismo estilo pero con subtítulo destacado
        <div className="flex flex-col items-center justify-center w-full">
          <h1 className="text-2xl font-black tracking-tight">
            <span className="text-black">HASHTAG</span>
            <span className="text-brand-gold">PE</span>
          </h1>
          <p className="text-sm font-bold text-indigo-600 tracking-wide mt-0.5">
            PANEL ADMIN
          </p>
        </div>
      )}
      {isMobile && (
        <button
          onClick={onCloseSidebar}
          className="p-2 rounded-lg transition-colors hover:bg-gray-100 text-black absolute right-4"
          aria-label="Cerrar menú"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );

  const SidebarNavigation = () => {
    // Definir estilos según el tipo de usuario
    const styles =
      userType === "admin"
        ? {
            activeClasses: "bg-brand-gold text-black shadow-md font-semibold",
            inactiveClasses: "text-gray-800 hover:bg-gray-100",
            barColor: "bg-brand-gold",
          }
        : {
            activeClasses: "bg-brand-gold text-black shadow-md font-semibold",
            inactiveClasses: "text-gray-800 hover:bg-gray-100",
            barColor: "bg-brand-gold",
          };

    return (
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={isMobile ? onCloseSidebar : undefined}
              className={`group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                active ? styles.activeClasses : styles.inactiveClasses
              }`}
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 ${styles.barColor} rounded-r-full`}
                ></div>
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
  };

  return (
    <>
      <SidebarHeader />
      <SidebarNavigation />
      <UserProfile user={user} onLogout={onLogout} userType={userType} />
    </>
  );
};

export default BaseSidebar;
