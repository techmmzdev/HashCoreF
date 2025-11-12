import { useState, useEffect, useCallback, memo, useRef } from "react";
import {
  Edit,
  Trash,
  Eye,
  MoreVertical,
  Star,
  Crown,
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  User,
  Building2,
  Mail,
  Phone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AdminClientDetailsModal from "@/components/admin/AdminClientDetailsModal";

// --- Badge del Plan ---
const PlanBadge = memo(({ plan }) => {
  const planConfig = {
    BASIC: {
      color: "bg-blue-100 text-blue-800",
      icon: Star,
      label: "Básico",
    },
    STANDARD: {
      color:
        "bg-purple-100 text-purple-800",
      icon: Crown,
      label: "Estándar",
    },
    FULL: {
      color:
        "bg-yellow-100 text-yellow-800",
      icon: Shield,
      label: "Premium",
    },
  };

  const config = planConfig[plan] || planConfig.BASIC;
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.color}`}
    >
      <IconComponent className="w-3 h-3 mr-1.5" />
      {config.label}
    </span>
  );
});

PlanBadge.displayName = "PlanBadge";

// --- Tarjeta de Cliente ---
const ClientCard = memo(
  ({
    user,
    activeDropdown,
    onToggleDropdown,
    onEdit,
    onDelete,
    onOpenDetails,
    onViewPublications,
  }) => {
    const client = user.clients?.[0];
    const isActive = client?.status;
    const dropdownRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState("bottom");

    useEffect(() => {
      if (activeDropdown !== user.id) return;

      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          onToggleDropdown(null);
        }
      };

      // Compute dropdown position on next frame to avoid layout thrash
      const raf = requestAnimationFrame(() => {
        const rect = dropdownRef.current?.getBoundingClientRect();
        if (rect && rect.bottom + 200 > window.innerHeight)
          setDropdownPosition("top");
        else setDropdownPosition("bottom");
      });

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [activeDropdown, user.id, onToggleDropdown]);

    return (
      <div className="group bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300">
        {/* Header de estado */}
        <div
          className={`h-2 rounded-t-2xl ${
            isActive
              ? "bg-linear-to-r from-green-400 to-emerald-500"
              : "bg-linear-to-r from-red-400 to-rose-500"
          }`}
        />

        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            {/* Info básica */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                  isActive
                    ? "bg-linear-to-br from-green-500 to-emerald-600"
                    : "bg-linear-to-br from-gray-500 to-gray-600"
                }`}
              >
                {client?.company_name
                  ? client.company_name.charAt(0).toUpperCase()
                  : user.email.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-gray-800 truncate">
                  {client?.company_name || "Empresa sin nombre"}
                </h3>
                <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  {user.email}
                </p>
              </div>
            </div>

            {/* Dropdown acciones */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDropdown(user.id);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Opciones"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {activeDropdown === user.id && (
                <div
                  className={`absolute right-0 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50 py-1 ${
                    dropdownPosition === "top"
                      ? "bottom-full mb-2"
                      : "top-full mt-2"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetails(user);
                      onToggleDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-3" /> Ver detalles
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(user);
                      onToggleDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-3" /> Editar
                  </button>

                  <hr className="my-1 border-gray-200" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(user);
                      onToggleDropdown(null);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                  >
                    <Trash className="w-4 h-4 mr-3" /> Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Información de contacto */}
          {client?.ruc && (
            <div className="mb-3 pb-3 border-b border-gray-100">
              <p className="text-sm text-gray-600 flex items-center gap-2 mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span className="font-medium">RUC: {client.ruc}</span>
              </p>
              {client?.contact_phone && (
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  {client.contact_phone}
                </p>
              )}
            </div>
          )}

          {/* Estado y plan */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isActive ? (
                  <CheckCircle className="w-3 h-3 mr-1.5" />
                ) : (
                  <XCircle className="w-3 h-3 mr-1.5" />
                )}
                {isActive ? "Activo" : "Inactivo"}
              </span>
              {client?.plan && <PlanBadge plan={client.plan} />}
            </div>
            <button
              onClick={() => client?.id && onViewPublications(client.id)}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors shadow-sm"
              title="Ver publicaciones de este cliente"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" />
              Publicaciones
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ClientCard.displayName = "ClientCard";

// --- Componente Principal ---
const AdminClientCardsView = ({ users, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserDetails, setSelectedUserDetails] = useState(null);

  const handleToggleDropdown = useCallback(
    (userId) => setActiveDropdown((prev) => (prev === userId ? null : userId)),
    []
  );

  const handleOpenDetailsModal = useCallback((user) => {
    setSelectedUserDetails(user);
    setIsDetailsModalOpen(true);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setIsDetailsModalOpen(false);
    setSelectedUserDetails(null);
  }, []);

  const handleViewPublications = useCallback(
    (clientId) => {
      navigate(`/admin/clients/${clientId}/publications`);
    },
    [navigate]
  );

  if (!users || users.length === 0) {
    return (
      <div className="bg-gray-50 text-gray-500 rounded-2xl text-center border-2 border-dashed border-gray-200 py-12 px-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
          <Building2 className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          No hay clientes registrados
        </h3>
        <p className="text-sm">
          Comienza creando tu primer cliente para gestionar sus publicaciones
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <ClientCard
            key={user.id}
            user={user}
            activeDropdown={activeDropdown}
            onToggleDropdown={handleToggleDropdown}
            onOpenDetails={handleOpenDetailsModal}
            onEdit={onEdit}
            onDelete={onDelete}
            onViewPublications={handleViewPublications}
          />
        ))}
      </div>
      <AdminClientDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        user={selectedUserDetails}
      />
    </>
  );
};

export default AdminClientCardsView;
