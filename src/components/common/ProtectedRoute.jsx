import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Componente para proteger rutas que requieren autenticación
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente a renderizar si está autenticado
 * @param {boolean} props.adminOnly - Si true, solo permite acceso a ADMIN
 * @param {boolean} props.clientOnly - Si true, solo permite acceso a CLIENTE
 */
function ProtectedRoute({ children, adminOnly = false, clientOnly = false }) {
  const { isAuthenticated, isAdmin, isClient, loading } = useAuth();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300">
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere ser ADMIN pero no lo es
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si requiere ser CLIENTE pero no lo es
  if (clientOnly && !isClient) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Si todo está bien, renderizar el componente hijo
  return children;
}

export default ProtectedRoute;
