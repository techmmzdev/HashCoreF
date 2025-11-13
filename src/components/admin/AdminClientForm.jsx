import { useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  User,
  Lock,
  Mail,
  Building2,
  Phone,
  Star,
  Crown,
  Shield,
} from "lucide-react";
import toast from "react-hot-toast";
import { useFormModal } from "@/hooks/useModal";
import { Input, Select, Checkbox } from "@/components/common/FormElements";
import { Button } from "@/components/common/UIComponents";

// Constantes extraídas para mejor rendimiento
const PLAN_OPTIONS = [
  { value: "BASIC", label: "⭐ Básico", icon: Star },
  { value: "STANDARD", label: "👑 Estándar", icon: Crown },
  { value: "FULL", label: "🛡️ Premium", icon: Shield },
];

// Configuración inicial del formulario
const INITIAL_FORM_DATA = {
  name: "",
  email: "",
  password: "",
  company_name: "",
  ruc: "",
  contact_email: "",
  contact_phone: "",
  status: true,
  plan: "BASIC",
};

const AdminClientForm = ({
  isOpen,
  onClose,
  initialUser,
  onSubmit,
  isLoading,
  error,
  onErrorClear,
}) => {
  // Memoizar isEditing para evitar recálculo
  const isEditing = useMemo(() => !!initialUser, [initialUser]);

  // Usar el hook personalizado para modal
  const { modalRef, firstInputRef, handleBackdropClick, handleContentClick } =
    useFormModal({ isOpen, onClose, isLoading });

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [validationErrors, setValidationErrors] = useState({});

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (!isOpen) return;

    const client = initialUser?.clients?.[0] || {};
    setFormData({
      name: initialUser?.name || "",
      email: initialUser?.email || "",
      password: "",
      company_name: client.company_name || "",
      ruc: client.ruc || "",
      contact_email: client.contact_email || initialUser?.email || "",
      contact_phone: client.contact_phone || "",
      status: client.status ?? true,
      plan: client.plan || "BASIC",
    });
    setValidationErrors({});
  }, [isOpen, initialUser]);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Clear form error when user starts typing
      if (error && onErrorClear) {
        onErrorClear();
      }

      // Clear validation error for this field
      setValidationErrors((prev) => {
        if (!prev[name]) return prev;
        const newErrors = { ...prev };
        delete newErrors[name];

        // Toast de información cuando se corrige un error
        if (
          Object.keys(prev).length > 0 &&
          Object.keys(newErrors).length === 0
        ) {
          toast.success("¡Perfecto! Todos los campos están completos", {
            icon: "✅",
          });
        }

        return newErrors;
      });
    },
    [error, onErrorClear]
  );

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.name?.trim()) {
      errors.name = "El nombre es requerido";
    }

    if (!formData.email?.trim()) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email inválido";
    }

    if (!isEditing && !formData.password?.trim()) {
      errors.password = "La contraseña es requerida";
    } else if (formData.password && formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.company_name?.trim()) {
      errors.company_name = "El nombre de la empresa es requerido";
    }

    if (
      formData.ruc?.trim() &&
      !/^[A-Za-z0-9]{1,20}$/.test(formData.ruc.trim())
    ) {
      errors.ruc = "El RUC debe tener máximo 20 caracteres alfanuméricos";
    }

    if (
      formData.contact_phone?.trim() &&
      !/^\d{9}$/.test(formData.contact_phone.trim())
    ) {
      errors.contact_phone = "El teléfono debe tener 9 dígitos numéricos";
    }

    if (
      formData.contact_email?.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)
    ) {
      errors.contact_email = "Email de contacto inválido";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData, isEditing]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      if (!validateForm()) {
        // Contar errores para mensaje más específico
        const errorCount = Object.keys(validationErrors).length;
        const firstError = Object.values(validationErrors)[0];

        // Toast para errores de validación local
        toast.error(
          errorCount > 1
            ? `Se encontraron ${errorCount} errores de validación. Por favor, revisa todos los campos.`
            : firstError ||
                "Por favor, completa todos los campos requeridos correctamente",
          {
            icon: "⚠️",
          }
        );
        return;
      }

      // Preparar payload según el backend
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company_name: formData.company_name.trim(),
        ruc: formData.ruc?.trim() || "",
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.trim(),
        status: formData.status,
        plan: formData.plan,
      };

      // Solo incluir password si está presente
      if (formData.password) {
        payload.password = formData.password;
      }

      onSubmit(payload);
    },
    [formData, validateForm, onSubmit, validationErrors]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col mx-4 sm:mx-0"
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 bg-linear-to-r from-indigo-50 to-blue-50">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
            </div>
            <span className="hidden sm:inline">
              {isEditing ? "Editar Cliente" : "Crear Nuevo Cliente"}
            </span>
            <span className="sm:hidden">{isEditing ? "Editar" : "Crear"}</span>
          </h2>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="secondary"
            size="sm"
            className="p-1.5 sm:p-2 rounded-full"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6"
          style={{
            WebkitOverflowScrolling: "touch",
            scrollBehavior: "smooth",
          }}
        >
          {/* Datos de Acceso */}
          <section className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Datos de Acceso
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                ref={firstInputRef}
                label="Nombre de Usuario"
                name="name"
                value={formData.name}
                onChange={handleChange}
                icon={User}
                required
                error={validationErrors.name}
                placeholder="Ej: Juan Pérez"
              />
              <Input
                label="Email de Acceso"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
                error={validationErrors.email}
                placeholder="usuario@ejemplo.com"
                disabled={isEditing}
              />
            </div>

            <Input
              label={
                isEditing
                  ? "Contraseña (dejar vacío para mantener actual)"
                  : "Contraseña"
              }
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              required={!isEditing}
              error={validationErrors.password}
              placeholder={
                isEditing
                  ? "Dejar vacío para no cambiar"
                  : "Mínimo 6 caracteres"
              }
            />
          </section>

          {/* Datos de la Empresa */}
          <section className="space-y-3 sm:space-y-4 border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Datos de la Empresa
            </h3>

            <Input
              label="Nombre de la Empresa"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              icon={Building2}
              required
              error={validationErrors.company_name}
              placeholder="Ej: Empresa S.A."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Input
                label="RUC"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                icon={Building2}
                error={validationErrors.ruc}
                placeholder="Ej: 20123456789 (máx. 20 caracteres)"
                maxLength={20}
              />
              <Input
                label="Teléfono de Contacto"
                name="contact_phone"
                type="tel"
                value={formData.contact_phone}
                onChange={handleChange}
                icon={Phone}
                error={validationErrors.contact_phone}
                placeholder="Ej: 987654321 (máx. 9 dígitos)"
                maxLength={9}
              />
            </div>

            <Input
              label="Email de Contacto"
              name="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={handleChange}
              icon={Mail}
              error={validationErrors.contact_email}
              placeholder="contacto@empresa.com"
            />
          </section>

          {/* Plan y Estado */}
          <section className="space-y-3 sm:space-y-4 border-t border-gray-200 pt-4 sm:pt-6">
            <h3 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Plan y Estado
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <Select
                label="Plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                options={PLAN_OPTIONS}
                required
              />

              <div className="flex items-end">
                <Checkbox
                  label={
                    formData.status
                      ? "✅ Cliente Activo"
                      : "❌ Cliente Inactivo"
                  }
                  name="status"
                  checked={formData.status}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            </div>
          </section>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 sm:pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              variant="secondary"
              fullWidth
              className="sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              variant="primary"
              loading={isLoading}
              fullWidth
              className="sm:w-auto"
            >
              {isEditing ? "💾 Guardar Cambios" : "✨ Crear Cliente"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminClientForm;
