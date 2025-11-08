/* eslint-disable no-unused-vars */
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { publicationService } from "@/services/publication";
import {
  FileText,
  Calendar,
  Download,
  Filter,
  Image,
  TrendingUp,
  Search,
  X,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ClientMediaModal from "@/components/client/ClientMediaModal";
import WhatsAppShareModal from "@/components/client/WhatsAppShareModal";
import { PublicationsGridSkeleton } from "@/components/common/Skeleton";
import { getMediaUrl } from "@/config/urls";

// Componente de ícono de WhatsApp personalizado
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const STATUS_CONFIG = {
  PUBLISHED: {
    label: "Editada",
    icon: CheckCircle,
    color: "text-green-500 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/20",
    badge:
      "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border border-green-200 dark:border-green-700",
    dot: "bg-green-500",
  },
  SCHEDULED: {
    label: "Programada",
    icon: Clock,
    color: "text-amber-500 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/20",
    badge:
      "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-200 border border-amber-200 dark:border-amber-700",
    dot: "bg-amber-500",
  },
  DRAFT: {
    icon: Clock,
    label: "En Proceso",
    color: "text-gray-500 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800/40",
    badge:
      "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600",
    dot: "bg-gray-500",
  },
};

const FILTER_OPTIONS = [
  { key: "ALL", label: "Todos" },
  { key: "PUBLISHED", label: "Editadas" },
  { key: "SCHEDULED", label: "Programadas" },
  { key: "DRAFT", label: "En Proceso" },
];

// Stat Card Component
const StatCard = memo(({ label, value, icon: Icon, color }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
          {value}
        </p>
      </div>
      {Icon && <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${color}`} />}
    </div>
  </div>
));

StatCard.displayName = "StatCard";

// Publication Card Component
const PublicationCard = memo(
  ({ pub, onViewMedia, onShareWhatsApp, onDownload, onDeleteRequest }) => {
    const pubStatusUpper = useMemo(
      () => (pub.status || "").toString().toUpperCase(),
      [pub.status]
    );

    const statusConfig = STATUS_CONFIG[pubStatusUpper];
    const mediaUrl = useMemo(
      () => (pub.media?.[0] ? getMediaUrl(pub.media[0].url) : null),
      [pub.media]
    );

    const isPublished = pub.status === "PUBLISHED";

    return (
      <div
        className={`rounded-xl sm:rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col ${
          statusConfig?.bg || "bg-gray-50 dark:bg-gray-800"
        } border-gray-100 dark:border-gray-700`}
      >
        {/* Preview Media */}
        <div className="relative w-full aspect-square bg-gray-900 overflow-hidden">
          {pub.media?.[0] && isPublished ? (
            <>
              {pub.media[0].media_type?.startsWith("video") ? (
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
                    <div className="bg-black/50 rounded-full p-3">
                      <svg
                        className="w-6 h-6 sm:w-8 sm:h-8 text-white fill-white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </>
              ) : pub.media[0].media_type?.startsWith("image") ? (
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
                <Image className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-30" />
                <p className="text-xs sm:text-sm">
                  {isPublished
                    ? "Sin multimedia"
                    : "Disponible cuando esté editada"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-2.5 sm:p-3 md:p-4 flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="mb-3 sm:mb-4">
            <div className="flex gap-1 sm:gap-2 items-start mb-2 min-w-0">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-indigo-500 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0 pr-2">
                <h3
                  className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 dark:text-white words line-clamp-2 cursor-help"
                  title={pub.title || "Sin título"}
                >
                  {pub.title || "Sin título"}
                </h3>
              </div>
            </div>
            <div className="flex justify-end">
              <span
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs font-semibold rounded-full whitespace-nowrap ${
                  statusConfig?.badge || ""
                }`}
              >
                {statusConfig?.label || "Desconocido"}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="text-[11px] sm:text-xs md:text-sm text-gray-600 dark:text-gray-400 space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 flex-1">
            <div className="flex items-center gap-1.5">
              <div
                className={`w-1.5 h-1.5 shrink-0 rounded-full ${
                  statusConfig?.dot || "bg-gray-500"
                }`}
              />
              <span className="truncate">
                <strong>Tipo:</strong> {pub.content_type || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 shrink-0" />
              <span className="truncate">
                {new Date(pub.publish_date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            {pub.media && pub.media.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Image className="w-3 h-3 shrink-0" />
                <span className="truncate">{pub.media.length} archivo(s)</span>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 pt-2 sm:pt-3 border-t border-gray-200 dark:border-gray-700 mt-auto">
            <ActionButton
              icon={WhatsAppIcon}
              color="green"
              onClick={() => onShareWhatsApp(pub)}
              disabled={!isPublished}
              tooltip="WhatsApp"
            />
            <ActionButton
              icon={Image}
              color="blue"
              onClick={() => onViewMedia(pub)}
              disabled={!isPublished || !pub.media || pub.media.length === 0}
              tooltip="Ver multimedia"
            />
            <ActionButton
              icon={Download}
              color="gray"
              onClick={() => onDownload(pub)}
              disabled={!isPublished || !pub.media || pub.media.length === 0}
              tooltip="Descargar"
            />
          </div>
        </div>
      </div>
    );
  }
);

PublicationCard.displayName = "PublicationCard";

// Action Button Component
const ActionButton = memo(
  ({ icon: Icon, color, onClick, disabled, tooltip }) => {
    const colorMap = {
      indigo:
        "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
      blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50",
      green:
        "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50",
      gray: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600",
    };

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        title={tooltip}
        className={`flex items-center justify-center p-1.5 sm:p-2 md:p-2.5 rounded-lg transition-all relative group touch-manipulation ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400"
            : colorMap[color]
        }`}
      >
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        {tooltip && (
          <span className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-gray-700 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {tooltip}
          </span>
        )}
      </button>
    );
  }
);

ActionButton.displayName = "ActionButton";

// Main Component
const ClientPublicationsPage = () => {
  const [publications, setPublications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch publications
  const fetchPublications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await publicationService.getMyPublications();
      setPublications(data || []);
    } catch (err) {
      console.error("Error al cargar publicaciones:", err);
      setError("Error al cargar publicaciones");
      toast.error(
        err?.message || "Error al cargar tus publicaciones. Intenta de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedMedia || selectedWhatsApp) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedMedia, selectedWhatsApp]);

  // Filter publications
  const filtered = useMemo(() => {
    let result = publications;

    if (filter !== "ALL") {
      result = result.filter(
        (p) =>
          (p.status || "").toString().toUpperCase() === filter.toUpperCase()
      );
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          (p.title || "").toLowerCase().includes(search) ||
          (p.content_type || "").toLowerCase().includes(search) ||
          (p.content || "").toLowerCase().includes(search)
      );
    }

    return result;
  }, [publications, filter, searchTerm]);

  // Handlers
  const handleDownload = useCallback(async (pub) => {
    if (pub.status !== "PUBLISHED") {
      toast.error("Solo puedes descargar publicaciones editadas");
      return;
    }

    const file = pub.media?.[0];
    if (!file?.url) {
      toast.error("No hay archivo disponible para descargar");
      return;
    }

    try {
      const fileUrl = getMediaUrl(file.url);
      if (!fileUrl) {
        toast.error("URL del archivo no válida");
        return;
      }

      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.url.split("/").pop() || "archivo";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Archivo descargado exitosamente");
    } catch (err) {
      console.error("Error al descargar archivo:", err);
      toast.error(`No se pudo descargar el archivo: ${err.message}`);
    }
  }, []);

  const handleViewMedia = useCallback((pub) => {
    if (pub.status !== "PUBLISHED") {
      toast.error(
        "No puedes ver los archivos multimedia hasta que la publicación esté editada"
      );
      return;
    }
    setSelectedMedia(pub);
  }, []);

  const handleWhatsAppShare = useCallback((pub) => {
    if (pub.status !== "PUBLISHED") {
      toast.error("Solo puedes compartir publicaciones que estén editadas");
      return;
    }
    setSelectedWhatsApp(pub);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilter("ALL");
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Loading state
  if (loading) {
    return (
      <>
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <div className="h-8 sm:h-10 md:h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 sm:w-80 animate-pulse mb-2" />
            <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 sm:w-60 animate-pulse" />
          </div>
        </div>
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <PublicationsGridSkeleton count={6} />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-0 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="p-8 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-3">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            <p className="text-red-600 dark:text-red-400 font-semibold">
              Error
            </p>
          </div>
          <p className="text-red-500 dark:text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={fetchPublications}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Mis Publicaciones
          </h2>
          <p className="flex items-center gap-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            <TrendingUp className="w-4 h-4" />
            {filtered.length} de {publications.length} publicación
            {publications.length !== 1 && "es"}
          </p>
        </div>

        {/* Info Badge */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium leading-tight">
            💡 Puedes ver todas tus publicaciones en cualquier estado
          </p>
          <p className="text-[10px] sm:text-xs mt-1 text-blue-600 dark:text-blue-300 leading-tight">
            Los archivos multimedia solo están disponibles cuando la publicación
            está <strong>Editada</strong>
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, tipo o contenido..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  filter === option.key
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Clear Filters Button */}
          {(searchTerm || filter !== "ALL") && (
            <button
              onClick={clearFilters}
              className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Limpiar filtros</span>
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 text-center sm:text-left">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Publications Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
          <FileText className="w-14 h-14 sm:w-16 sm:h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 text-center">
            {searchTerm
              ? "No se encontraron publicaciones"
              : "No hay publicaciones"}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2 text-center max-w-md">
            {searchTerm
              ? "Intenta con otro término de búsqueda"
              : "Tus publicaciones aparecerán aquí una vez que el administrador las cree."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          <AnimatePresence>
            {filtered.map((pub) => (
              <PublicationCard
                key={pub.id}
                pub={pub}
                onViewMedia={handleViewMedia}
                onShareWhatsApp={handleWhatsAppShare}
                onDownload={handleDownload}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modales */}
      <ClientMediaModal
        isOpen={!!selectedMedia}
        onClose={() => setSelectedMedia(null)}
        publication={selectedMedia}
      />
      <WhatsAppShareModal
        isOpen={!!selectedWhatsApp}
        onClose={() => setSelectedWhatsApp(null)}
        publication={selectedWhatsApp}
      />
    </>
  );
};

export default ClientPublicationsPage;
