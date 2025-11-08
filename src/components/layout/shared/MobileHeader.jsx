import { Menu, Bell } from "lucide-react";
import { Link } from "react-router-dom";
import AppLogo from "./AppLogo";

const MobileHeader = ({
  onOpenSidebar,
  title,
  notificationCount = 0,
  notificationLink = "#",
  userType = "client",
}) => {
  return (
    <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <AppLogo size="small" variant="mobile" />
          <span className="font-semibold text-gray-800 dark:text-white">
            {title}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {userType === "client" ? (
          <Link
            to={notificationLink}
            className="relative p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </Link>
        ) : (
          <button
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            aria-label="Notificaciones"
          >
            <Bell className="w-5 h-5" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

export default MobileHeader;
