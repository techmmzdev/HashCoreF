import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * ErrorBoundary - Captura errores de React y previene pantallas en blanco
 * Este componente envuelve toda la aplicación y muestra una UI amigable cuando hay errores
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError() {
    // Actualiza el estado para mostrar la UI de fallback
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Puedes enviar el error a un servicio de logging (Sentry, LogRocket, etc.)
    console.error("ErrorBoundary capturó un error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Opcional: Enviar a servicio de logging
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // UI de fallback cuando hay un error
      return (
        <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-red-200 dark:border-red-800">
            <div className="flex flex-col items-center text-center">
              {/* Icono de error */}
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>

              {/* Título */}
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                ¡Oops! Algo salió mal
              </h1>

              {/* Descripción */}
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                Lo sentimos, ha ocurrido un error inesperado. No te preocupes,
                nuestro equipo ya fue notificado. Por favor intenta recargar la
                página.
              </p>

              {/* Detalles del error (solo en desarrollo) */}
              {import.meta.env.DEV && this.state.error && (
                <details className="w-full mb-6 text-left">
                  <summary className="cursor-pointer text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                    Detalles técnicos (solo visible en desarrollo)
                  </summary>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 overflow-auto max-h-64">
                    <pre className="text-xs text-red-800 dark:text-red-200 whitespace-pre-wrap">
                      {this.state.error.toString()}
                      {"\n\n"}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  </div>
                </details>
              )}

              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={this.handleReload}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-lg"
                >
                  <RefreshCw className="w-5 h-5" />
                  Recargar Página
                </button>

                <button
                  onClick={this.handleGoHome}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors border border-gray-300 dark:border-gray-600"
                >
                  <Home className="w-5 h-5" />
                  Ir al Inicio
                </button>
              </div>

              {/* Información adicional */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-6">
                Si el problema persiste, por favor contacta al soporte técnico.
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Si no hay error, renderiza los children normalmente
    return this.props.children;
  }
}

export default ErrorBoundary;
