import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { clientService } from "@/services/client";
import { userService } from "@/services/user";
import { AlertCircle, CheckCircle2, User } from "lucide-react";
import {
  ProfileSidebar,
  ProfileInformationForm,
  PasswordChangeSection,
} from "@/components/profile";
import { Button } from "@/components/common/UIComponents";
import { ClientProfileSkeleton } from "../../components/common/Skeleton";

function ClientProfilePage() {
  const { user } = useAuth();
  const {
    data: clientData,
    isLoading: loading,
    isError,
    error: queryError,
    refetch: refetchClient,
  } = useQuery({
    queryKey: ["clientProfile"],
    queryFn: clientService.getMyClientInfo,
    staleTime: 1000 * 60 * 2,
  });

  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    ruc: "",
    contact_email: "",
    contact_phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    if (clientData) {
      setFormData({
        company_name: clientData.company_name || "",
        ruc: clientData.ruc || "",
        contact_email: clientData.contact_email || "",
        contact_phone: clientData.contact_phone || "",
      });
    }
  }, [clientData]);

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (clientData) {
      setFormData({
        company_name: clientData.company_name || "",
        ruc: clientData.ruc || "",
        contact_email: clientData.contact_email || "",
        contact_phone: clientData.contact_phone || "",
      });
    }
    setError(null);
    setSuccess(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await clientService.updateMyClientInfo(formData);
      await refetchClient();
      toast.success("Perfil actualizado exitosamente");
      setSuccess("Perfil actualizado exitosamente");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      toast.error(err.message || "Error al actualizar el perfil");
      setError(err.message || "Error al actualizar el perfil");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Todos los campos son obligatorios");
      setPasswordError("Todos los campos son obligatorios");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres");
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast.error("La nueva contraseña debe ser diferente a la actual");
      setPasswordError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setSavingPassword(true);

    try {
      await userService.changeMyPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      toast.success("Contraseña actualizada exitosamente");
      setPasswordSuccess("Contraseña actualizada exitosamente");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch (err) {
      console.error("Error cambiando contraseña:", err);
      toast.error(err.message || "Error al cambiar la contraseña");
      setPasswordError(err.message || "Error al cambiar la contraseña");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordError(null);
    setPasswordSuccess(null);
    setShowPasswordModal(false);
  };

  if (loading) {
    return <ClientProfileSkeleton />;
  }

  if (isError && !clientData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-1">
                Error al cargar el perfil
              </h3>
              <p className="text-red-700">
                {queryError?.message ||
                  "Error al cargar la información del perfil"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800">
                Mi Perfil
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-0.5">
                Gestiona tu información personal y de empresa
              </p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="mb-2 bg-green-50 border border-green-200 rounded-xl p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm sm:text-base text-green-700 font-medium">
                {success}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-2 bg-red-50 border border-red-200 rounded-xl p-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm sm:text-base text-red-700 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-2">
              <ProfileSidebar user={user} clientData={clientData} />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4">
            <ProfileInformationForm
              clientData={clientData}
              isEditing={isEditing}
              formData={formData}
              saving={saving}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />

            {/* Botón para abrir el modal de cambio de contraseña */}
            <div className="flex justify-end">
              <Button
                variant="danger"
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-2"
              >
                Cambiar contraseña
              </Button>
            </div>

            {/* Modal de cambio de contraseña */}
            {showPasswordModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div
                  className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-2 sm:mx-auto p-4 sm:p-6 relative"
                  style={{
                    maxHeight: "95vh",
                    overflowY: "auto",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  <PasswordChangeSection
                    passwordData={passwordData}
                    passwordError={passwordError}
                    passwordSuccess={passwordSuccess}
                    savingPassword={savingPassword}
                    onPasswordChange={handlePasswordChange}
                    onPasswordSubmit={handlePasswordSubmit}
                    onCancel={handleCancelPassword}
                  />
                  <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-3xl sm:text-4xl"
                    onClick={handleCancelPassword}
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientProfilePage;
