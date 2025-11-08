import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Plus, Search, Users, UserX, Loader2, Shield } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { userService } from "@/services/user";
import toast from "react-hot-toast";
import AdminsTableView from "@/components/admin/AdminsTableView";
import AdminForm from "@/components/admin/AdminForm";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { AdminsPageSkeleton } from "../../components/common/Skeleton";

const StatCard = memo(({ stat }) => {
  const Icon = stat.icon;
  return (
    <div
      className={`${stat.bgLight} ${stat.darkBg} rounded-xl shadow-sm border border-gray-200 dark:border-gray-700/50 overflow-hidden`}
    >
      <div className="p-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            {stat.name}
          </p>
          <div className={`text-3xl font-bold ${stat.textColor} mt-1`}>
            {stat.value}
          </div>
        </div>
        <div className={`p-3 rounded-lg bg-linear-to-br ${stat.color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
});

StatCard.displayName = "StatCard";

const STATS_CONFIG = [
  {
    name: "Total Administradores",
    key: "total",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    bgLight: "bg-blue-50",
    darkBg: "dark:bg-blue-900/20",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Primer Administrador",
    key: "firstDate",
    icon: Shield,
    color: "from-indigo-500 to-indigo-600",
    bgLight: "bg-indigo-50",
    darkBg: "dark:bg-indigo-900/20",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Último Administrador",
    key: "lastDate",
    icon: Shield,
    color: "from-purple-500 to-purple-600",
    bgLight: "bg-purple-50",
    darkBg: "dark:bg-purple-900/20",
    textColor: "text-purple-600 dark:text-purple-400",
  },
];

const AdminsPage = () => {
  const { isAdmin } = useAuth();

  // Data
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // UI modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  // Form state
  const [adminToEdit, setAdminToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchTerm(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch admins
  const fetchAdmins = useCallback(async () => {
    if (!isAdmin) {
      setError("Acceso denegado. Se requiere rol de Administrador.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const allUsers = await userService.getAllUsers();
      // Filtrar solo admins
      const adminUsers = allUsers.filter((user) => user.role === "ADMIN");
      setAdmins(adminUsers || []);
    } catch (err) {
      console.error("Error al obtener administradores:", err);
      setError(
        err?.response?.data?.message ||
          "Error al cargar la lista de administradores."
      );
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const filteredAdmins = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return admins.filter(
      (admin) =>
        admin.name?.toLowerCase().includes(search) ||
        admin.email?.toLowerCase().includes(search)
    );
  }, [admins, searchTerm]);

  const statsData = useMemo(() => {
    const totalAdmins = admins.length;

    if (totalAdmins === 0) {
      return {
        total: 0,
        firstDate: "-",
        lastDate: "-",
      };
    }

    const sortedAdmins = [...admins].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );

    const firstAdminDate = sortedAdmins[0]?.created_at
      ? new Date(sortedAdmins[0].created_at).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

    const lastAdminDate = sortedAdmins[sortedAdmins.length - 1]?.created_at
      ? new Date(
          sortedAdmins[sortedAdmins.length - 1].created_at
        ).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

    return {
      total: totalAdmins,
      firstDate: firstAdminDate,
      lastDate: lastAdminDate,
    };
  }, [admins]);

  const stats = useMemo(
    () =>
      STATS_CONFIG.map((config) => ({
        ...config,
        value: statsData[config.key],
      })),
    [statsData]
  );

  // Handlers
  const handleSearchChange = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);

  const handleOpenCreate = useCallback(() => {
    setAdminToEdit(null);
    setIsFormModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((admin) => {
    setAdminToEdit(admin);
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setAdminToEdit(null);
  }, []);

  const handleSubmitForm = useCallback(
    async (formData) => {
      setIsSubmitting(true);
      try {
        // Forzar rol ADMIN
        const adminData = { ...formData, role: "ADMIN" };

        if (adminToEdit) {
          // Editar
          await userService.updateUser(adminToEdit.id, adminData);
          toast.success(
            `Administrador "${formData.name}" actualizado correctamente`
          );
        } else {
          // Crear
          await userService.createUser(adminData);
          toast.success(
            `Administrador "${formData.name}" creado correctamente`
          );
        }

        await fetchAdmins();
        handleCloseFormModal();
      } catch (err) {
        console.error("Error al guardar administrador:", err);
        const errorMsg =
          err?.response?.data?.message || "Error al guardar el administrador";
        toast.error(errorMsg, {
          duration: 5000,
        });
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [adminToEdit, fetchAdmins, handleCloseFormModal]
  );

  const handleOpenDelete = useCallback((admin) => {
    setAdminToDelete(admin);
    setIsDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!adminToDelete) return;

    try {
      setIsSubmitting(true);
      await userService.deleteUser(adminToDelete.id);

      // Toast de éxito personalizado para eliminación
      toast.success(
        `Administrador "${adminToDelete.name}" eliminado correctamente`
      );

      await fetchAdmins();
    } catch (err) {
      console.error("Error eliminando administrador:", err);
      toast.error(
        err?.response?.data?.message ||
          `Error al eliminar el administrador "${adminToDelete.name}"`
      );
    } finally {
      setIsSubmitting(false);
      setIsDeleteConfirmOpen(false);
      setAdminToDelete(null);
    }
  }, [adminToDelete, fetchAdmins]);

  // Loading state
  if (loading) {
    return <AdminsPageSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-xl">
        <div className="flex items-start gap-3">
          <UserX className="w-6 h-6 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-300">
              Error al cargar los administradores
            </p>
            <p className="text-red-800 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
            <button
              onClick={fetchAdmins}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Gestión de Administradores
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra los usuarios con permisos de administrador
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Crear Administrador
        </button>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </section>

      {/* Search */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </section>

      {/* Table */}
      <AdminsTableView
        admins={filteredAdmins}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Modals */}
      <AdminForm
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        initialUser={adminToEdit}
        onSubmit={handleSubmitForm}
        isLoading={isSubmitting}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setAdminToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar administrador"
        message={`¿Seguro que deseas eliminar al administrador ${
          adminToDelete?.name || adminToDelete?.email || ""
        }? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminsPage;
