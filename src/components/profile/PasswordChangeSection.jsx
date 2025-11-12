import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function PasswordChangeSection({
  passwordData,
  passwordError,
  passwordSuccess,
  savingPassword,
  onPasswordChange,
  onPasswordSubmit,
  onCancel,
}) {
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCancel = () => {
    setShowPasswordSection(false);
    onCancel();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onPasswordSubmit(e);
  };

  // Validación visual de fortaleza de contraseña
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, text: "", color: "" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { level: 0, text: "Muy débil", color: "bg-red-500" },
      { level: 1, text: "Débil", color: "bg-orange-500" },
      { level: 2, text: "Regular", color: "bg-yellow-500" },
      { level: 3, text: "Buena", color: "bg-lime-500" },
      { level: 4, text: "Fuerte", color: "bg-green-500" },
      { level: 5, text: "Muy fuerte", color: "bg-emerald-600" },
    ];

    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-6 overflow-hidden">
      {/* Header expandible */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-linear-to-r from-red-50 to-pink-50 border-b border-red-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-red-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">
                Seguridad de la Cuenta
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                {showPasswordSection
                  ? "Actualiza tu contraseña"
                  : "Protege tu cuenta"}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-all duration-200 shadow-sm border border-gray-200 font-medium text-sm ml-2"
          >
            <Lock className="w-4 h-4" />
            <span className="hidden sm:inline">
              {showPasswordSection ? "Ocultar" : "Cambiar"}
            </span>
            {showPasswordSection ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Mensajes de estado */}
      {passwordSuccess && (
        <div className="mx-4 sm:mx-6 mt-4 bg-green-50 border border-green-200 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-sm text-green-700 font-medium">
              {passwordSuccess}
            </p>
          </div>
        </div>
      )}

      {passwordError && (
        <div className="mx-4 sm:mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-700 font-medium">
              {passwordError}
            </p>
          </div>
        </div>
      )}

      {/* Formulario de cambio de contraseña */}
      {showPasswordSection && (
        <div className="p-4 sm:p-6">
          <div className="space-y-4">
            {/* Contraseña actual */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <KeyRound className="w-4 h-4 text-gray-500" />
                Contraseña Actual
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={onPasswordChange}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-400 transition-all text-sm sm:text-base"
                  placeholder="Ingresa tu contraseña actual"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={onPasswordChange}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-400 transition-all text-sm sm:text-base"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Indicador de fortaleza */}
              {passwordData.newPassword && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{
                          width: `${(passwordStrength.level / 5) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-600 min-w-80px text-right">
                      {passwordStrength.text}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Usa mayúsculas, minúsculas, números y símbolos
                  </p>
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-4 h-4 text-gray-500" />
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={onPasswordChange}
                  className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 placeholder-gray-400 transition-all text-sm sm:text-base"
                  placeholder="Confirma tu nueva contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordData.confirmPassword &&
                passwordData.newPassword !== passwordData.confirmPassword && (
                  <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Las contraseñas no coinciden
                  </p>
                )}
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={savingPassword}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleFormSubmit}
                disabled={savingPassword}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-red-400 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Actualizando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Actualizar Contraseña</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PasswordChangeSection;
