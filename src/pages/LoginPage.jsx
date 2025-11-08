import { useState, useRef, useEffect, useCallback } from "react";
import SplashScreen from "@/components/common/SplashScreen";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import OptimizedImage from "@/components/common/OptimizedImage";
import loginBg from "@/assets/logo.png";
import loginBgWebp from "@/assets/logo.webp";

// Constantes extraídas fuera del componente
const SPLASH_COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutos en millisegundos

// Estilos memoizados para evitar recreación
const ICON_STYLE = { color: "#9CA3AF" };
const DOT_PATTERN_STYLE = {
  backgroundImage: "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
  backgroundSize: "30px 30px",
};

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Función optimizada para splash - memoizada
  const shouldShowSplash = useCallback(() => {
    const lastSplashTime = sessionStorage.getItem("lastSplashTime");
    const now = Date.now();

    if (!lastSplashTime) {
      return true; // Primera vez en la sesión
    }

    return now - parseInt(lastSplashTime) > SPLASH_COOLDOWN_TIME;
  }, []);

  // ✅ Memoizar el resultado del splash para evitar recálculo
  const [showSplash, setShowSplash] = useState(() => shouldShowSplash());

  const passwordRef = useRef(null);

  // ✅ useAuth provee todo lo necesario
  const {
    login,
    error,
    loading,
    clearError,
    isAuthenticated,
    isAdmin,
    isClient,
  } = useAuth();
  const navigate = useNavigate();

  // Auto-redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else if (isClient) {
        navigate("/client", { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, isClient, navigate]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      // Limpiar error cuando el usuario empieza a escribir
      if (error) {
        clearError();
      }
    },
    [error, clearError]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // Validación básica
      if (!formData.email || !formData.password) {
        return;
      }

      try {
        const response = await login(formData.email, formData.password);

        // ✅ Login exitoso - redirigir según rol
        if (response.user.role === "ADMIN") {
          navigate("/admin", { replace: true });
        } else if (response.user.role === "CLIENTE") {
          navigate("/client", { replace: true });
        }
      } catch (err) {
        const errorMessage = typeof err === "string" ? err : err?.message || "";

        if (
          errorMessage.includes("Usuario no encontrado") ||
          errorMessage.includes("inactiva")
        ) {
          // Limpiar ambos campos y enfocar email
          setFormData({ email: "", password: "" });
          document.getElementById("email")?.focus();
        } else if (errorMessage.includes("Contraseña Inválida")) {
          // Limpiar solo password y enfocarlo
          setFormData((prev) => ({ ...prev, password: "" }));
          passwordRef.current?.focus();
        } else {
          // Comportamiento por defecto: limpiar solo password
          setFormData((prev) => ({ ...prev, password: "" }));
          passwordRef.current?.focus();
        }
      }
    },
    [formData, login, navigate]
  );

  // ✅ Función para manejar el fin del splash - memoizada
  const handleSplashFinish = useCallback(() => {
    // Guardar timestamp actual para no mostrar splash por 5 minutos
    sessionStorage.setItem("lastSplashTime", Date.now().toString());
    setShowSplash(false);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden px-4">
          {/* Fondo con patrón moderno */}
          <div className="absolute inset-0 z-0 bg-linear-to-br from-gray-900 via-black to-gray-900">
            {/* Patrón de puntos - más visible con blanco */}
            <div className="absolute inset-0 opacity-25">
              <div className="absolute inset-0" style={DOT_PATTERN_STYLE}></div>
            </div>
            {/* Overlay con gradiente */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/60"></div>
          </div>

          <div className="relative z-10 w-full max-w-md h-full flex flex-col justify-center py-4 sm:py-6">
            {/* Logo y Header Superior - responsive mejorado y clickeable */}
            <div className="text-center mb-3 sm:mb-4">
              <Link
                to="/"
                className="inline-block mb-3 sm:mb-4 transition-transform duration-300 cursor-pointer"
                title="Ir al inicio"
              >
                <OptimizedImage
                  src={loginBg}
                  webpSrc={loginBgWebp}
                  alt="HASHTAGPERÚ Logo"
                  className="h-20 sm:h-24 md:h-28 w-auto mx-auto drop-shadow-2xl transition-all duration-300"
                  priority={true} // Logo en login page es crítico
                  lazy={false}
                />
              </Link>
            </div>

            {/* Card de Login */}
            <div className="bg-white dark:bg-slate-800 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 md:p-9 space-y-5 border border-gray-200 dark:border-slate-700">
              {/* Header del Card */}
              <div className="text-center space-y-1.5">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  Iniciar Sesión
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Campo Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Mail
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        style={ICON_STYLE}
                      />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      aria-label="Correo electrónico"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      className="block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="ejemplo@email.com"
                    />
                  </div>
                </div>

                {/* Campo Contraseña */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        style={ICON_STYLE}
                      />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      aria-label="Contraseña"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      className="block w-full pl-10 sm:pl-12 pr-11 sm:pr-13 py-3 sm:py-3.5 text-sm sm:text-base border-2 border-gray-300 dark:border-slate-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-700 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="••••••••"
                      ref={passwordRef}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center disabled:opacity-50 rounded-r-xl transition-opacity"
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                    >
                      {showPassword ? (
                        <EyeOff
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          style={ICON_STYLE}
                        />
                      ) : (
                        <Eye
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          style={ICON_STYLE}
                        />
                      )}
                    </button>
                  </div>
                </div>

                {/* Mensaje de Error */}
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 px-3 sm:px-4 py-3 rounded-xl text-xs sm:text-sm animate-shake">
                    <p className="font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      Error de inicio de sesión
                    </p>
                    <p className="mt-1 ml-3.5">{error}</p>
                  </div>
                )}

                {/* Botón de Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3 sm:py-3.5 px-4 border border-transparent rounded-xl text-black text-sm sm:text-base font-bold bg-brand-gold hover:bg-brand-gold-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
                >
                  {loading ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Iniciando sesión...
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                      Iniciar sesión
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-200 dark:border-slate-700">
                <p>
                  ¿Olvidaste tu contraseña?{" "}
                  <a
                    // href="#"
                    className="font-semibold text-brand-gold dark:text-brand-gold hover:text-brand-gold-hover dark:hover:text-brand-gold-hover transition-colors underline decoration-dotted underline-offset-2"
                  >
                    Recupérala aquí
                  </a>
                </p>
              </div>
            </div>

            {/* Derechos */}
            <div className="text-center mt-4 sm:mt-5 space-y-1">
              <p className="text-white/90 text-xs sm:text-sm font-medium">
                © 2025 Hashtag Pe
              </p>
              <p className="text-white/60 text-[10px] sm:text-xs">
                Marketing & Publicidad Digital
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginPage;
