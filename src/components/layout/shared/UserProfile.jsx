import { User, LogOut } from "lucide-react";

const UserProfile = ({ user, onLogout, userType = "client" }) => {
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

  const colors =
    userType === "admin"
      ? {
          borderColor: "border-gray-200",
          bgSection: "bg-gray-50",
          bgAvatar: "bg-gradient-to-br from-gray-700 to-gray-900",
          textName: "text-black",
          textSubtitle: "text-gray-600",
          textExtra: "text-gray-500",
          btnBg: "bg-brand-gold hover:bg-brand-gold-hover",
          btnText: "text-black font-semibold",
        }
      : {
          borderColor: "border-gray-200",
          bgSection: "bg-gray-50",
          bgAvatar: "bg-gradient-to-br from-gray-700 to-gray-900",
          textName: "text-black",
          textSubtitle: "text-gray-600",
          textExtra: "text-gray-500",
          btnBg: "bg-brand-orange hover:bg-brand-orange-hover",
          btnText: "text-white font-semibold",
        };

  return (
    <div
      className={`${colors.borderColor} border-t ${colors.bgSection} p-4 space-y-4`}
    >
      {/* Perfil */}
      <div className="flex items-center gap-3 px-2">
        <div
          className={`w-12 h-12 rounded-lg ${colors.bgAvatar} flex items-center justify-center shrink-0 shadow-lg`}
        >
          <User className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-semibold ${colors.textName} truncate`}>
            {userInfo.name}
          </p>
          <p className={`text-xs ${colors.textSubtitle} truncate`}>
            {userInfo.subtitle}
          </p>
          {userInfo.extraInfo && (
            <p className={`text-xs ${colors.textExtra} truncate`}>
              {userInfo.extraInfo}
            </p>
          )}
        </div>
      </div>

      {/* Botón de Cerrar sesión */}
      <button
        onClick={onLogout}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium ${colors.btnText} ${colors.btnBg} rounded-lg transition-all duration-200`}
      >
        <LogOut className="w-4 h-4" />
        Cerrar Sesión
      </button>
    </div>
  );
};

export default UserProfile;
