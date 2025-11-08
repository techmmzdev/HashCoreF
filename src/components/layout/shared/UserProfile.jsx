import { User, LogOut } from "lucide-react";

const UserProfile = ({ user, onLogout, userType = "client" }) => {
  // Función para obtener información específica según el tipo de usuario
  const getUserInfo = () => {
    if (userType === "admin") {
      return {
        name: user?.name || "Administrador",
        subtitle: user?.email || user?.role || "Admin",
        extraInfo: null,
      };
    } else {
      return {
        name: user?.name || "Cliente",
        subtitle: `Plan: ${user?.plan || "BASIC"}`,
        extraInfo: user?.companyName || user?.email || "Sin información",
      };
    }
  };

  const userInfo = getUserInfo();

  return (
    <div className="border-t border-indigo-700 dark:border-gray-700 p-4 bg-indigo-700/50 dark:bg-gray-800/50 space-y-4">
      <div className="flex items-center gap-3 px-2">
        <div className="w-12 h-12 rounded-lg bg-linear-to-br from-indigo-300 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {userInfo.name}
          </p>
          <p className="text-xs text-indigo-200 dark:text-gray-400 truncate">
            {userInfo.subtitle}
          </p>
          {userInfo.extraInfo && (
            <p className="text-xs text-indigo-300 dark:text-gray-500 truncate">
              {userInfo.extraInfo}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-indigo-100 bg-indigo-600/50 hover:bg-indigo-600 hover:text-white rounded-lg transition-all duration-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </button>
    </div>
  );
};

export default UserProfile;
