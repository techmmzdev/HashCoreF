import {
  Building2,
  Mail,
  Phone,
  CreditCard,
  Edit3,
  Save,
  X,
  Loader2,
  Info,
  Clock,
} from "lucide-react";

function ProfileInformationForm({
  isEditing,
  formData,
  saving,
  onEdit,
  onCancel,
  onChange,
  onSubmit,
}) {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header compacto y moderno */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-linear-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-b border-yellow-100 dark:border-yellow-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Información Empresarial
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                {isEditing ? "Editando datos" : "Datos de tu empresa"}
              </p>
            </div>
          </div>

          {/* Botones de acción */}
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm sm:text-base"
            >
              <Edit3 className="w-4 h-4" />
              <span>Editar</span>
            </button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={onCancel}
                disabled={saving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:active:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                onClick={handleFormSubmit}
                disabled={saving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 disabled:bg-green-400 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:cursor-not-allowed font-medium text-sm"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Nombre de la empresa */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              Nombre de la Empresa
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={onChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm sm:text-base"
              placeholder="Ej: Constructora ABC S.A.C."
            />
          </div>

          {/* RUC */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              RUC
            </label>
            <input
              type="text"
              name="ruc"
              value={formData.ruc}
              onChange={onChange}
              disabled={!isEditing}
              maxLength={20}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm sm:text-base font-mono"
              placeholder="Ej: 20123456789 (máx. 20 caracteres)"
            />
          </div>

          {/* Email de contacto */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email de Contacto
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={onChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm sm:text-base"
              placeholder="contacto@empresa.com"
            />
          </div>

          {/* Teléfono de contacto */}
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={onChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all text-sm sm:text-base"
              placeholder="Ej: 987654321 (máx. 9 dígitos)"
              maxLength={9}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileInformationForm;
