import { useNavigate } from "react-router-dom";
import { ShieldAlert, Home } from "lucide-react";

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/20">
            <ShieldAlert className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Acceso Denegado
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              No tienes permisos para acceder a esta página.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              Volver Atrás
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 px-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Ir al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnauthorizedPage;
