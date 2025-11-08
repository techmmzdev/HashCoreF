import { User, Calendar, Shield, Package, Crown, Sparkles } from "lucide-react";

function ProfileSidebar({ user, clientData }) {
  const getPlanConfig = (plan) => {
    const configs = {
      BASIC: {
        gradient: "from-gray-400 to-gray-600",
        bgColor: "bg-gray-50 dark:bg-gray-900/50",
        textColor: "text-gray-700 dark:text-gray-300",
        borderColor: "border-gray-200 dark:border-gray-700",
        icon: Sparkles,
        stars: 1,
      },
      STANDARD: {
        gradient: "from-blue-400 to-blue-600",
        bgColor: "bg-blue-50 dark:bg-blue-900/20",
        textColor: "text-blue-700 dark:text-blue-400",
        borderColor: "border-blue-200 dark:border-blue-800",
        icon: Package,
        stars: 2,
      },
      FULL: {
        gradient: "from-purple-400 via-pink-500 to-purple-600",
        bgColor: "bg-purple-50 dark:bg-purple-900/20",
        textColor: "text-purple-700 dark:text-purple-400",
        borderColor: "border-purple-200 dark:border-purple-800",
        icon: Crown,
        stars: 3,
      },
    };
    return configs[plan] || configs.BASIC;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const planConfig = getPlanConfig(clientData?.plan);
  const PlanIcon = planConfig.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header compacto con gradiente dinámico */}
      <div
        className={`h-20 sm:h-24 bg-linear-to-br ${planConfig.gradient} relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <div
            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${planConfig.bgColor} ${planConfig.textColor} backdrop-blur-sm border ${planConfig.borderColor}`}
          >
            <PlanIcon className="w-3 h-3" />
            <span className="hidden sm:inline">{clientData?.plan}</span>
            <span>{"⭐".repeat(planConfig.stars)}</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
        {/* Avatar y nombre */}
        <div className="flex flex-col items-center -mt-10 sm:-mt-12">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-xl border-4 border-white dark:border-gray-800 transition-transform hover:scale-105">
              <User className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600" />
            </div>
            {/* Status indicator */}
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
              <div
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 sm:border-3 border-white dark:border-gray-800 ${
                  clientData?.status ? "bg-green-500" : "bg-red-500"
                }`}
              >
                <div
                  className={`w-full h-full rounded-full ${
                    clientData?.status ? "bg-green-500 animate-ping" : ""
                  } opacity-75`}
                ></div>
              </div>
            </div>
          </div>

          <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-gray-900 dark:text-white text-center leading-tight px-2">
            {user?.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 text-center break-all px-2">
            {user?.email}
          </p>

          {/* Status badge */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-gray-900/50">
            <div
              className={`w-2 h-2 rounded-full ${
                clientData?.status ? "bg-green-500" : "bg-red-500"
              } animate-pulse`}
            ></div>
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
              {clientData?.status ? "Activa" : "Inactiva"}
            </span>
          </div>
        </div>

        {/* Grid de información compacta */}
        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-3">
            {/* Miembro desde */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Miembro desde
                </p>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold mt-0.5 truncate">
                  {formatDate(clientData?.created_at)}
                </p>
              </div>
            </div>

            {/* Rol */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900/70 transition-colors">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Rol de usuario
                </p>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold mt-0.5">
                  Cliente
                </p>
              </div>
            </div>

            {/* Plan completo - solo visible en móvil */}
            <div className="sm:hidden flex items-start gap-3 p-3 rounded-lg bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center shrink-0 shadow-sm">
                <PlanIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  Plan actual
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-bold mt-0.5 flex items-center gap-2">
                  {clientData?.plan}
                  <span className="text-xs">
                    {"⭐".repeat(planConfig.stars)}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSidebar;
