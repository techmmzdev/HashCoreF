import { useState, useEffect, useCallback, useMemo, memo } from "react";
import {
  Plus,
  ChevronLeft,
  Edit,
  Trash2,
  Search,
  Image,
  Calendar,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  MessageSquare,
  Play,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { publicationService } from "@/services/publication";
import { clientService } from "@/services/client";
import PublicationForm from "@/components/admin/PublicationForm";
import MediaModal from "@/components/admin/MediaModal";
import PublicationCommentsModal from "@/components/admin/PublicationCommentsModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { PublicationsGridSkeleton } from "../../components/common/Skeleton";
import { getMediaUrl } from "@/config/urls"; // Usar función centralizada

const STATUS_CONFIG = {
  PUBLISHED: {
    label: "Editadas",
    icon: CheckCircle,
    color: "text-green-500 dark:text-green-400",
    emoji: "✓",
    bgClass:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  DRAFT: {
    label: "En Proceso",
    icon: Clock,
    color: "text-amber-600 dark:text-amber-400",
    emoji: "✎",
    bgClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  SCHEDULED: {
    label: "Programadas",
    icon: Clock,
    color: "text-indigo-500 dark:text-indigo-400",
    emoji: "⏰",
    bgClass:
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  },
};

const FILTER_OPTIONS = [
  { key: "ALL", label: "Todas" },
  { key: "PUBLISHED", label: "Editadas" },
  { key: "SCHEDULED", label: "Programadas" },
  { key: "DRAFT", label: "En Proceso" },
];

const StatCard = memo(({ label, value, icon: Icon, color, emoji }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">
          {value}
        </p>
      </div>
      {Icon ? (
        <Icon className={`h-8 w-8 ${color}`} />
      ) : (
        <div className="text-3xl">{emoji}</div>
      )}
    </div>
  </div>
));

StatCard.displayName = "StatCard";

const PublicationCard = memo(
  ({ pub, onEdit, onDelete, onOpenMedia, onOpenComments }) => {
    const pubStatusUpper = useMemo(
      () => (pub.status || "").toString().toUpperCase(),
      [pub.status]
    );

    const statusConfig = STATUS_CONFIG[pubStatusUpper];
    const formattedDate = useMemo(
      () =>
        pub.created_at
          ? new Date(pub.created_at).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
            })
          : null,
      [pub.created_at]
    );

    const mediaUrl = useMemo(
      () => (pub.media?.[0] ? getMediaUrl(pub.media[0].url) : null),
      [pub.media]
    );

    return (
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Preview Media */}
        <div className="relative w-full h-48 bg-gray-900 overflow-hidden">
          {pub.media?.[0] ? (
            <>
              {pub.media[0].media_type.startsWith("video") ? (
                <>
                  <video
                    src={mediaUrl}
                    onError={(e) => {
                      console.error("Error cargando video:", e.target.src);
                      e.target.style.display = "none";
                    }}
                    className="w-full h-full object-contain"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => {
                      e.target.pause();
                      e.target.currentTime = 0;
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-black/50 rounded-full p-4">
                      <Play className="w-10 h-10 text-white fill-white" />
                    </div>
                  </div>
                </>
              ) : pub.media[0].media_type.startsWith("image") ? (
                <img
                  src={mediaUrl}
                  alt="preview"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              ) : null}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Sin multimedia</p>
              </div>
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="p-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {pub.title || "Sin título"}
          </h3>

          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {pub.content_type && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                  {pub.content_type}
                </span>
              )}
              {statusConfig && (
                <span
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusConfig.bgClass}`}
                >
                  {statusConfig.emoji}
                </span>
              )}
            </div>
            {formattedDate && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3" />
                <span className="text-[10px]">{formattedDate}</span>
              </div>
            )}
          </div>

          {/* Botones de Acción */}
          <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
            <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => onOpenComments(pub)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                title="Comentarios"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={() => onOpenMedia(pub)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                title="Media"
              >
                <Image className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEdit(pub)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(pub)}
                className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PublicationCard.displayName = "PublicationCard";

const ClientPublicationsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();

  // Estados
  const [publications, setPublications] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // Modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [publicationToEdit, setPublicationToEdit] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [selectedPublicationForMedia, setSelectedPublicationForMedia] =
    useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  // Fetch data
  const fetchPublications = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      setError(null);
      const [clientData, publicationsData] = await Promise.all([
        clientService.getClientById(clientId),
        publicationService.getPublicationsByClient(clientId),
      ]);
      setClient(clientData);
      setPublications(publicationsData || []);
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
      setError("Error al cargar las publicaciones del cliente.");
      toast.error("Error al cargar las publicaciones");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // Filtros
  const filteredPublications = useMemo(() => {
    const lower = searchTerm.trim().toLowerCase();

    return publications.filter((pub) => {
      const matchesSearch =
        !lower ||
        (pub.title || "").toLowerCase().includes(lower) ||
        (pub.content_type || "").toLowerCase().includes(lower) ||
        (pub.content || "").toLowerCase().includes(lower);

      const pubStatusUpper = (pub.status || "").toString().toUpperCase();
      const filterStatus = (selectedStatus || "").toString().toUpperCase();
      const matchesStatus =
        filterStatus === "ALL" || pubStatusUpper === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [publications, searchTerm, selectedStatus]);

  // Estadísticas optimizadas
  const stats = useMemo(() => {
    const statusCounts = publications.reduce((acc, p) => {
      const status = (p.status || "").toString().toUpperCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return [
      {
        label: "Total",
        value: publications.length,
        emoji: "📊",
      },
      {
        label: STATUS_CONFIG.PUBLISHED.label,
        value: statusCounts.PUBLISHED || 0,
        icon: STATUS_CONFIG.PUBLISHED.icon,
        color: STATUS_CONFIG.PUBLISHED.color,
      },
      {
        label: STATUS_CONFIG.DRAFT.label,
        value: statusCounts.DRAFT || 0,
        icon: STATUS_CONFIG.DRAFT.icon,
        color: STATUS_CONFIG.DRAFT.color,
      },
      {
        label: STATUS_CONFIG.SCHEDULED.label,
        value: statusCounts.SCHEDULED || 0,
        icon: STATUS_CONFIG.SCHEDULED.icon,
        color: STATUS_CONFIG.SCHEDULED.color,
      },
    ];
  }, [publications]);

  // Handlers optimizados
  const handleOpenCreate = useCallback(() => {
    setPublicationToEdit(null);
    setIsFormModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((publication) => {
    setPublicationToEdit(publication);
    setIsFormModalOpen(true);
  }, []);

  const handleCloseFormModal = useCallback(() => {
    setIsFormModalOpen(false);
    setPublicationToEdit(null);
  }, []);

  const handleOpenMediaModal = useCallback((publication) => {
    setSelectedPublicationForMedia(publication);
    setIsMediaModalOpen(true);
  }, []);

  const handleOpenConfirmDelete = useCallback((publication) => {
    setPublicationToEdit(publication);
    setIsConfirmModalOpen(true);
  }, []);

  const handleOpenCommentsModal = useCallback((publication) => {
    setSelectedPublicationForMedia(publication);
    setIsCommentsModalOpen(true);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setSelectedStatus(status);
  }, []);

  // Mutations
  const handleSavePublication = async (data) => {
    if (!clientId) return;
    setIsSubmitting(true);
    const isEditing = !!data.id;
    try {
      let response;
      if (isEditing) {
        response = await publicationService.updatePublication(data.id, data);

        // Verificar si se eliminaron archivos multimedia
        if (response.deletedMedia && response.deletedMedia.length > 0) {
          toast.success(
            `Publicación actualizada. Se eliminaron ${response.deletedMedia.length} archivo(s) incompatible(s).`,
            { duration: 5000 }
          );
        } else {
          toast.success("Publicación actualizada con éxito");
        }
      } else {
        response = await publicationService.createPublication(clientId, data);
        toast.success("Publicación creada con éxito");
      }

      handleCloseFormModal();
      await fetchPublications();
    } catch (err) {
      console.error("Error al guardar publicación:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error al guardar publicación"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!publicationToEdit?.id) return;
    try {
      await publicationService.deletePublication(publicationToEdit.id);
      toast.success("Publicación eliminada con éxito");
      setIsConfirmModalOpen(false);
      setPublicationToEdit(null);
      await fetchPublications();
    } catch (err) {
      console.error("Error al eliminar publicación:", err);
      toast.error(
        err?.response?.data?.message || "Error al eliminar publicación"
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-96 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Publications Grid Skeleton */}
          <PublicationsGridSkeleton count={9} />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="p-8 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Error
            </p>
          </div>
          <p className="text-red-500 dark:text-red-300">{error}</p>
          <button
            onClick={fetchPublications}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const companyName = client?.company_name || `Cliente #${clientId}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/clients")}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Publicaciones de
            </h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold text-lg">
              {companyName}
            </p>
          </div>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Crear Publicación
        </button>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </section>

      {/* Buscador y Filtros */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, tipo o contenido..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {FILTER_OPTIONS.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleStatusFilterChange(filter.key)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                    selectedStatus === filter.key
                      ? "bg-indigo-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {filteredPublications.length} resultado
              {filteredPublications.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Publicaciones */}
      <section>
        {filteredPublications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
            <Plus className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              {searchTerm
                ? "No se encontraron publicaciones"
                : "Este cliente aún no tiene publicaciones"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              {searchTerm
                ? "Intenta con otro término de búsqueda"
                : "¡Crea la primera publicación para comenzar!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPublications.map((pub) => (
              <PublicationCard
                key={pub.id}
                pub={pub}
                onEdit={handleOpenEdit}
                onDelete={handleOpenConfirmDelete}
                onOpenMedia={handleOpenMediaModal}
                onOpenComments={handleOpenCommentsModal}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modales */}
      <PublicationForm
        selectedPublication={publicationToEdit}
        clientId={clientId}
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSave={handleSavePublication}
        isLoading={isSubmitting}
      />

      <MediaModal
        publication={selectedPublicationForMedia}
        publicationId={selectedPublicationForMedia?.id}
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onUploaded={fetchPublications}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPublicationToEdit(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar publicación"
        message={`¿Seguro que deseas eliminar "${
          publicationToEdit?.title || "Sin título"
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        isLoading={isSubmitting}
      />

      <PublicationCommentsModal
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        publication={selectedPublicationForMedia}
      />
    </div>
  );
};

export default ClientPublicationsPage;
