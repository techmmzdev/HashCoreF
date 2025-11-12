import { Menu, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";

const MobileHeader = ({
  onOpenSidebar,
  // notificationCount y notificationLink eliminados
  userType = "client",
}) => {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        {userType === "client" ? (
          // Cliente: Texto estilizado
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight leading-tight">
              <span className="text-black">HASHTAG</span>
              <span className="text-brand-gold">PE</span>
            </h1>
            <p className="text-[10px] text-indigo-600 tracking-wide -mt-0.5">
              Marketing & Publicidad
            </p>
          </div>
        ) : (
          // Admin: Mismo estilo pero con "PANEL ADMIN" más destacado
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight leading-tight">
              <span className="text-black">HASHTAG</span>
              <span className="text-brand-gold">PE</span>
            </h1>
            <p className="text-xs font-bold text-indigo-600 tracking-wide -mt-0.5">
              PANEL ADMIN
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Ícono de notificaciones eliminado */}
      </div>
    </header>
  );
};

export default MobileHeader;
