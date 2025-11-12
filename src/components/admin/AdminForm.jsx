import React, { useState, useEffect } from "react";
import { Shield, Mail, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useFormModal } from "@/hooks/useModal";
import { Input } from "@/components/common/FormElements";
import { Button, Modal } from "@/components/common/UIComponents";

const AdminForm = ({ isOpen, onClose, initialUser, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const isEditing = !!initialUser;

  // Usar el hook personalizado para modal
  const { modalRef, firstInputRef, handleBackdropClick, handleContentClick } =
    useFormModal({ isOpen, onClose, isLoading });

  // Cargar datos iniciales si es edición
  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: initialUser?.name || "",
      email: initialUser?.email || "",
      password: "",
    });
    setErrors({});
  }, [isOpen, initialUser]);

  // Manejador de cambio de inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validar campos
  const validate = () => {
    const newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "El nombre es requerido";

    if (!formData.email?.trim()) {
      newErrors.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Correo electrónico inválido";
    }

    // Validar contraseña
    if (!isEditing && !formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const dataToSubmit = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: "ADMIN",
      };

      if (formData.password) dataToSubmit.password = formData.password;

      await onSubmit(dataToSubmit);

      // Solo mostrar toast si el componente padre no maneja los toasts
      // El toast se maneja en AdminsPage.jsx
    } catch (error) {
      console.error("Error en handleSubmit:", error);

      // Toast de error para problemas de validación locales
      if (error?.validation) {
        toast.error(`Error de validación: ${error.message}`, {
          duration: 4000,
          position: "top-right",
        });
      }
      // Los errores de servidor se manejan en el componente padre
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm min-h-screen"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl max-h-[80vh] p-0 flex flex-col overflow-hidden mx-4 sm:mx-0"
        onClick={handleContentClick}
      >
        {/* Header */}
        <div className="p-6 sm:p-8 flex items-center justify-between border-b border-gray-100 bg-white">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-indigo-600" />
            {isEditing ? "Editar Administrador" : "Crear Administrador"}
          </h3>
          <Button
            onClick={onClose}
            disabled={isLoading}
            variant="secondary"
            size="sm"
            aria-label="Cerrar"
            className="p-2 rounded-full"
          >
            ✕
          </Button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6"
        >
          <section>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              👤 Información del Administrador
            </h4>

            <div className="space-y-4">
              {/* Nombre */}
              <Input
                ref={firstInputRef}
                label="Nombre completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                error={errors.name}
                placeholder="Ej: Juan Pérez"
                disabled={isLoading}
              />

              {/* Email */}
              <Input
                label="Correo electrónico"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                icon={Mail}
                required
                error={errors.email}
                placeholder="admin@example.com"
                disabled={isLoading}
              />

              {/* Password */}
              <Input
                label={
                  isEditing
                    ? "Contraseña (Opcional - dejar vacío para mantener la actual)"
                    : "Contraseña"
                }
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                icon={Lock}
                required={!isEditing}
                error={errors.password}
                placeholder={isEditing ? "••••••••" : "Mínimo 6 caracteres"}
                disabled={isLoading}
              />

              {/* Rol */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol
                </label>
                <div className="flex items-center px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg">
                  <Shield className="w-5 h-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-semibold text-gray-900">
                    ADMINISTRADOR
                  </span>
                </div>
              </div>
            </div>
          </section>
        </form>

        {/* Footer */}
        <div className="border-t border-gray-100 bg-white p-4 sm:p-6 flex justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            loading={isLoading}
            variant="primary"
          >
            {isEditing ? "Actualizar" : "Crear"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminForm;
