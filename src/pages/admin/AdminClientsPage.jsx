import { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  UserCheck,
  UserX,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { clientService } from "@/services/client";
import { userService } from "@/services/user";
import toast from "react-hot-toast";
import AdminClientCardsView from "@/components/admin/AdminClientCardsView";
import AdminClientForm from "@/components/admin/AdminClientForm";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { ClientsTableSkeleton } from "../../components/common/Skeleton";

/**
 * Componente memoizado para las tarjetas de estadísticas
 * Solo se re-renderiza si cambian sus props (stat)
 */
const StatCard = memo(({ stat }) => {
  const Icon = stat.icon;
  return (
    <div
      className={`${stat.bgLight} ${stat.darkBg} rounded-xl shadow-sm border border-gray-200 overflow-hidden`}
    >
      <div className="p-5 flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
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
    name: "Total Clientes",
    key: "total",
    icon: Users,
    color: "from-blue-500 to-blue-600",
    textColor: "text-blue-600",
    bgLight: "bg-blue-50",
    darkBg: "",
  },
  {
    name: "Clientes Activos",
    key: "active",
    icon: UserCheck,
    color: "from-green-500 to-green-600",
    textColor: "text-green-600",
    bgLight: "bg-green-50",
    darkBg: "",
  },
  {
    name: "Clientes Inactivos",
    key: "inactive",
    icon: UserX,
    color: "from-red-500 to-red-600",
    textColor: "text-red-600",
    bgLight: "bg-red-50",
    darkBg: "",
  },
];

const FILTER_OPTIONS = {
  status: [
    { value: "all", label: "📊 Todos los estados" },
    { value: "active", label: "✅ Activos" },
    { value: "inactive", label: "❌ Inactivos" },
  ],
  plan: [
    { value: "all", label: "🎁 Todos los planes" },
    { value: "basic", label: "⭐ Básico" },
    { value: "standard", label: "⭐⭐ Estándar" },
    { value: "full", label: "⭐⭐⭐ Premium" },
  ],
};

const AdminClientsPage = () => {
  const { isAdmin } = useAuth();

  // Data
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");

  // UI modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form state
  const [userToEdit, setUserToEdit] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);

  const transformClientsToUsers = useCallback(
    (clients) =>
      clients.map((client) => ({
        id: client.user?.id,
        email: client.user?.email,
        name: client.user?.name,
        role: client.user?.role,
        isActive: client.status,
        created_at: client.created_at,
        updated_at: client.updated_at,
        clients: [
          {
            id: client.id,
            company_name: client.company_name,
            ruc: client.ruc,
            contact_email: client.contact_email,
            contact_phone: client.contact_phone,
            status: client.status,
            plan: client.plan || "BASIC",
          },
        ],
      })),
    []
  );

  useEffect(() => {
    if (isFormModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isFormModalOpen]);

  // Fetch clients
  const fetchClients = useCallback(async () => {
    if (!isAdmin) {
      setError("Acceso denegado. Se requiere rol de Administrador.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await clientService.getAllClients();
      setClients(transformClientsToUsers(data || []));
    } catch (err) {
      console.error("Error al obtener clientes:", err);

      let errorMsg =
        "Error al cargar la lista de clientes. Verifica el servidor.";
      if (typeof err === "string") {
        errorMsg = err;
      } else if (err?.message) {
        errorMsg = err.message;
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      setError(errorMsg);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [isAdmin, transformClientsToUsers]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Filtered clients
  const filteredClients = useMemo(() => {
    const query = (searchTerm || "").toLowerCase();
    return clients.filter((user) => {
      const client = user?.clients?.[0];
      if (!client) return false;

      const company = (client.company_name || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const name = (user.name || "").toLowerCase();
      const ruc = (client.ruc || "").toLowerCase();

      const matchesSearch =
        query === "" ||
        email.includes(query) ||
        company.includes(query) ||
        name.includes(query) ||
        ruc.includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && client.status) ||
        (statusFilter === "inactive" && !client.status);

      const matchesPlan =
        planFilter === "all" || client.plan === planFilter.toUpperCase();

      return matchesSearch && matchesStatus && matchesPlan;
    });
  }, [clients, searchTerm, statusFilter, planFilter]);

  // Stats
  const stats = useMemo(() => {
    const total = filteredClients.length;
    const active = filteredClients.filter((u) => u.clients?.[0]?.status).length;
    const inactive = total - active;

    const values = { total, active, inactive };

    return STATS_CONFIG.map((config) => ({
      ...config,
      value: values[config.key],
    }));
  }, [filteredClients]);

  // Pagination
  const paginationData = useMemo(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(filteredClients.length / pageSize)
    );
    const start = (currentPage - 1) * pageSize;
    const paginatedClients = filteredClients.slice(start, start + pageSize);

    return { totalPages, paginatedClients };
  }, [filteredClients, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = useCallback((filterType, value) => {
    if (filterType === "status") {
      setStatusFilter(value);
    } else if (filterType === "plan") {
      setPlanFilter(value);
    }
    setCurrentPage(1);
  }, []);

  const handleSearchInputChange = useCallback((e) => {
    setSearchInput(e.target.value);
  }, []);
  const handleOpenCreate = () => {
    setUserToEdit(null);
    setFormError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = useCallback((user) => {
    setUserToEdit(user);
    setFormError(null);
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setUserToEdit(null);
  };

  const handleClearFormError = () => {
    setFormError(null);
  };

  const handleSubmitForm = async (formData) => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      if (userToEdit) {
        // Actualizar cliente existente usando userService para manejar contraseñas
        const userId = userToEdit.id;
        await userService.updateUserWithClient(userId, formData);
        toast.success(
          `Cliente "${formData.company_name}" actualizado correctamente`
        );
      } else {
        // Crear nuevo cliente
        await clientService.createClient(formData);
        toast.success(
          `Cliente "${formData.company_name}" creado correctamente`
        );
      }

      await fetchClients();
      handleCloseFormModal();
    } catch (err) {
      console.error("Error al guardar cliente:", err);

      // Mejorar extracción del mensaje de error
      let errorMsg = "Error al procesar la solicitud. Verifica los datos.";

      if (typeof err === "string") {
        errorMsg = err;
      } else if (err?.message) {
        errorMsg = err.message;
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.response?.data) {
        errorMsg =
          typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data);
      }

      setFormError(errorMsg);
      toast.error(errorMsg, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = (page) => {
    const newPage = Math.min(Math.max(1, page), paginationData.totalPages);
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value) || 8);
    setCurrentPage(1);
  };

  const handleOpenDelete = useCallback((user) => {
    setUserToDelete(user);
    setIsDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!userToDelete) return;

    const userId = userToDelete.id; // users.id
    const clientName =
      userToDelete.clients?.[0]?.company_name || userToDelete.name;

    try {
      setIsSubmitting(true);
      await clientService.deleteClient(userId);

      // Toast de éxito personalizado para eliminación
      toast.success(`Cliente "${clientName}" eliminado correctamente`, {
        icon: "🗑️",
      });

      await fetchClients();
    } catch (err) {
      console.error("Error eliminando cliente:", err);

      let errorMsg = `Error al eliminar el cliente "${clientName}"`;
      if (typeof err === "string") {
        errorMsg = err;
      } else if (err?.message) {
        errorMsg = err.message;
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      toast.error(errorMsg, {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
      setIsDeleteConfirmOpen(false);
      setUserToDelete(null);
    }
  }, [userToDelete, fetchClients]);

  // Loading state
  if (loading) {
    return <ClientsTableSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
        <div className="flex items-start gap-3">
          <UserX className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">
              Error al cargar los clientes
            </p>
            <p className="text-red-800 text-sm mt-1">
              {error}
            </p>
            <button
              onClick={fetchClients}
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
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Clientes
          </h1>
          <p className="text-gray-600 mt-1">
            Administra y monitorea todos tus clientes en un solo lugar
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Crear Cliente
        </button>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.name} stat={stat} />
        ))}
      </section>

      {/* Filters */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, empresa o RUC..."
              value={searchInput}
              onChange={handleSearchInputChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {FILTER_OPTIONS.status.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={planFilter}
            onChange={(e) => handleFilterChange("plan", e.target.value)}
            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {FILTER_OPTIONS.plan.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Cards Grid */}
      <AdminClientCardsView
        users={paginationData.paginatedClients}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
      />

      {/* Pagination */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-bold text-gray-900">
              {filteredClients.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
            </span>{" "}
            a{" "}
            <span className="font-bold text-gray-900">
              {Math.min(currentPage * pageSize, filteredClients.length)}
            </span>{" "}
            de{" "}
            <span className="font-bold text-gray-900">
              {filteredClients.length}
            </span>{" "}
            clientes
          </div>

          <div className="flex items-center gap-4 text-sm">
            {/* Selector de cantidad de ítems */}
            <label className="flex items-center gap-2">
              <span className="text-gray-600">Items:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="rounded border border-gray-300 bg-transparent px-2 py-1"
              >
                {[4, 8].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>

            {/* Controles de paginación */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 border rounded disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2">
                {paginationData.totalPages === 0 ? 0 : currentPage} /{" "}
                {paginationData.totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage === paginationData.totalPages ||
                  paginationData.totalPages === 0
                }
                className="p-1 border rounded disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <AdminClientForm
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        initialUser={userToEdit}
        onSubmit={handleSubmitForm}
        isLoading={isSubmitting}
        error={formError}
        onErrorClear={handleClearFormError}
      />

      <ConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => {
          setIsDeleteConfirmOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar cliente"
        message={`¿Seguro que deseas eliminar al cliente ${
          userToDelete?.name || userToDelete?.email || ""
        }? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminClientsPage;
