import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full text-center">
        <div className="space-y-6">
          {/* 404 Text */}
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-brand-orange">404</h1>
            <h2 className="text-3xl font-bold text-gray-900">
              Página no encontrada
            </h2>
            <p className="text-gray-600">
              La página que buscas no existe o ha sido movida.
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 px-4 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
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

export default NotFoundPage;
