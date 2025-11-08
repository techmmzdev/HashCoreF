import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { clientService } from "@/services/client";
import { userService } from "@/services/user";
import { Loader2, AlertCircle, CheckCircle2, User } from "lucide-react";
import {
  ProfileSidebar,
  ProfileInformationForm,
  PasswordChangeSection,
} from "@/components/profile";
import { ClientProfileSkeleton } from "../../components/common/Skeleton";

function ClientProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [clientData, setClientData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    loadClientProfile();
  }, []);

  const loadClientProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await clientService.getMyClientInfo();
      setClientData(data);
      setFormData({
        company_name: data.company_name || "",
        ruc: data.ruc || "",
        contact_email: data.contact_email || "",
        contact_phone: data.contact_phone || "",
      });
    } catch (err) {
      console.error("Error cargando perfil:", err);
      setError("Error al cargar la información del perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      company_name: clientData.company_name || "",
      ruc: clientData.ruc || "",
      contact_email: clientData.contact_email || "",
      contact_phone: clientData.contact_phone || "",
    });
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
      await loadClientProfile();
      setSuccess("Perfil actualizado exitosamente");
      setIsEditing(false);
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Error actualizando perfil:", err);
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
      setPasswordError("Todos los campos son obligatorios");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setPasswordError("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setSavingPassword(true);

    try {
      await userService.changeMyPassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      setPasswordSuccess("Contraseña actualizada exitosamente");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordSuccess(null), 5000);
    } catch (err) {
      console.error("Error cambiando contraseña:", err);
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
  };

  if (loading) {
    return <ClientProfileSkeleton />;
  }

  if (error && !clientData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-1">
                Error al cargar el perfil
              </h3>
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Header moderno */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white">
                Mi Perfil
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-0.5">
                Gestiona tu información personal y de empresa
              </p>
            </div>
          </div>
        </div>

        {/* Mensajes de estado globales */}
        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm sm:text-base text-green-700 dark:text-green-400 font-medium">
                {success}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-sm sm:text-base text-red-700 dark:text-red-400 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Layout principal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-6">
              <ProfileSidebar user={user} clientData={clientData} />
            </div>
          </div>

          {/* Contenido principal */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-4 sm:space-y-6">
            {/* Formulario de información */}
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

            {/* Sección de seguridad */}
            <PasswordChangeSection
              passwordData={passwordData}
              passwordError={passwordError}
              passwordSuccess={passwordSuccess}
              savingPassword={savingPassword}
              onPasswordChange={handlePasswordChange}
              onPasswordSubmit={handlePasswordSubmit}
              onCancel={handleCancelPassword}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ClientProfilePage;
