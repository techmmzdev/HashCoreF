/* eslint-disable no-unused-vars */
import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
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
  Share2,
  Eye,
} from "lucide-react";
import { AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import ClientMediaModal from "@/components/client/ClientMediaModal";
import WhatsAppShareModal from "@/components/client/WhatsAppShareModal";
import { ClientPublicationsPageSkeleton } from "@/components/common/Skeleton";
import { getMediaUrl } from "@/config/urls";
import Pagination from "@/components/common/Pagination";
import { usePagination } from "@/hooks/usePagination";

const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const STATUS_CONFIG = {
  PUBLISHED: {
    label: "Editada",
    icon: CheckCircle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-300",
    dot: "bg-emerald-500",
  },
  SCHEDULED: {
    label: "Programada",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
    badge: "bg-amber-100 text-amber-700 border border-amber-300",
    dot: "bg-amber-500",
  },
};

const FILTER_OPTIONS = [
  { key: "ALL", label: "Todos" },
  { key: "PUBLISHED", label: "Editadas" },
  { key: "SCHEDULED", label: "Programadas" },
];

const StatCard = memo(({ label, value, icon: Icon, color }) => (
  <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl p-6 border shadow-sm select-none">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
          {label}
        </p>
        <p className="text-4xl font-bold text-gray-900 mt-3">{value}</p>
      </div>
      {Icon && <Icon className={`h-8 w-8 ${color}`} />}
    </div>
  </div>
));
StatCard.displayName = "StatCard";

const PublicationCard = memo(
  ({ pub, onViewMedia, onShareWhatsApp, onDownload }) => {
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

    // Ref para el video
    const videoRef = useRef(null);
    useEffect(() => {
      function handleClickOutside(event) {
        if (videoRef.current && !videoRef.current.contains(event.target)) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    return (
      <div
        className="rounded-xl overflow-hidden shadow-sm flex flex-col bg-white select-none transition-all duration-300"
        style={{ touchAction: "manipulation" }}
      >
        {/* Preview Media */}
        <div
          className="relative w-full aspect-square bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden"
          style={{ minHeight: 80 }}
        >
          {pub.media?.[0] && isPublished ? (
            <>
              {pub.media[0].media_type?.startsWith("video") ? (
                <video
                  ref={videoRef}
                  src={mediaUrl}
                  onError={(e) => {
                    console.error("Error cargando video:", e.target.src);
                    e.target.style.display = "none";
                  }}
                  className="w-full h-full object-contain"
                  loop
                  playsInline
                  onClick={(e) => {
                    e.target.currentTime = 0;
                    if (e.target.paused) {
                      e.target.play();
                    } else {
                      e.target.pause();
                    }
                  }}
                />
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
              <div className="text-center text-slate-500">
                <Image className="w-12 h-12 mx-auto mb-3 opacity-25" />
                <p className="text-xs font-medium">
                  {isPublished
                    ? "Sin multimedia"
                    : "Disponible cuando esté editada"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 flex flex-col flex-1 min-w-0">
          {/* Header */}
          <div className="mb-2">
            <div className="flex gap-2 items-start mb-2 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <h3
                  className="font-bold text-sm text-gray-900 line-clamp-2 cursor-help"
                  title={pub.title || "Sin título"}
                  style={{ WebkitTapHighlightColor: "transparent" }}
                >
                  {pub.title || "Sin título"}
                </h3>
              </div>
            </div>
            <div className="flex justify-end">
              <span
                className={`px-3 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
                  statusConfig?.badge || ""
                }`}
              >
                {statusConfig?.label || "Desconocido"}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-gray-600 space-y-2 mb-2 flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`w-2.5 h-2.5 shrink-0 rounded-full ${
                  statusConfig?.dot || "bg-gray-500"
                }`}
              />
              <span className="truncate font-medium">
                {pub.content_type || "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0 text-gray-400" />
                <span className="truncate font-medium">
                  {new Date(pub.publish_date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              {pub.media && pub.media.length > 0 && (
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 shrink-0 text-gray-400" />
                  <span className="truncate font-medium">
                    {pub.media.length} archivo(s)
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 mt-auto">
            <ActionButton
              icon={WhatsAppIcon}
              color="green"
              onClick={() => onShareWhatsApp(pub)}
              disabled={!isPublished}
              label="WhatsApp"
            />
            <ActionButton
              icon={Eye}
              color="blue"
              onClick={() => onViewMedia(pub)}
              disabled={!isPublished || !pub.media || pub.media.length === 0}
              label="Ver"
            />
            <ActionButton
              icon={Download}
              color="gray"
              onClick={() => onDownload(pub)}
              disabled={!isPublished || !pub.media || pub.media.length === 0}
              label="Descargar"
            />
          </div>
        </div>
      </div>
    );
  }
);

PublicationCard.displayName = "PublicationCard";

const ActionButton = memo(({ icon: Icon, color, onClick, disabled, label }) => {
  const colorMap = {
    green: "bg-emerald-50 text-emerald-600 border border-emerald-200",
    blue: "bg-blue-50 text-blue-600 border border-blue-200",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl transition-all relative group ${
        disabled
          ? "opacity-40 cursor-not-allowed bg-gray-50 text-gray-400 border border-gray-100"
          : colorMap[color]
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
});

ActionButton.displayName = "ActionButton";

const ClientPublicationsPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("ALL");
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedWhatsApp, setSelectedWhatsApp] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: publications = [],
    isLoading: loading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clientPublications", user?.clientId],
    queryFn: publicationService.getMyPublications,
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
    enabled: !!user?.clientId,
  });

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

  // Paginación correcta (igual que Admin)
  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedItems,
    setPage,
    setPageSize,
  } = usePagination(filtered, 4);

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

  if (loading) {
    return <ClientPublicationsPageSkeleton count={6} />;
  }

  if (isError) {
    return (
      <div className="min-h-0 flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-6">
        <div className="p-8 rounded-2xl bg-red-50 border border-red-300 text-center max-w-md">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <p className="text-red-600 font-bold text-lg">Error</p>
          </div>
          <p className="text-red-600 text-sm mb-6">
            {error?.message || "Error al cargar publicaciones"}
          </p>
          <button
            onClick={refetch}
            className="px-5 py-3 bg-linear-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold text-sm"
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
      <div className="flex flex-col gap-4 mb-8 px-4 md:px-0">
        <div
          className="rounded-lg md:rounded-xl overflow-hidden shadow-lg flex flex-col bg-linear-to-br from-white via-gray-50 to-indigo-50 select-none transition-all duration-300 p-4 md:p-5"
          style={{ touchAction: "manipulation" }}
        >
          <div className="flex items-center gap-4 mb-3">
            {/* Título principal */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-indigo-900 select-none">
              Mis Publicaciones
            </h1>
          </div>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            {filtered.length === publications.length
              ? "Mostrando todas tus publicaciones"
              : filtered.length === 0
              ? "No hay coincidencias con los filtros o búsqueda"
              : `Mostrando ${filtered.length} resultado${
                  filtered.length > 1 ? "s" : ""
                } filtrado${filtered.length > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Info Badge */}
        <div className="bg-linear-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg md:rounded-2xl px-4 md:px-5 py-3 md:py-4 text-blue-900 flex flex-col gap-2 md:gap-3">
          <span className="flex items-start md:items-center gap-3 font-semibold text-xs md:text-sm leading-snug md:leading-normal">
            <span className="text-base md:text-lg shrink-0">💡</span>
            <span>
              Publicaciones en cualquier estado
              <span className="block md:inline text-blue-700 font-bold md:ml-2">
                | Multimedia solo si está <strong>Editada</strong>
              </span>
            </span>
          </span>
          <span className="flex items-start md:items-center gap-2 text-emerald-700 font-semibold text-xs md:text-sm leading-snug md:leading-normal">
            <span className="shrink-0">✓</span>
            <span>
              Usa <strong>WhatsApp</strong> para pedir cambios o aclarar dudas
            </span>
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-8 bg-linear-to-br from-white to-gray-50 rounded-2xl shadow-md border border-gray-200 p-6 space-y-5">
        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, tipo o contenido..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 text-base rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="w-5 h-5 text-gray-500 shrink-0" />
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  filter === option.key
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white text-gray-700 border-2 border-gray-300"
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
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 border border-red-300 rounded-xl"
            >
              <X className="w-4 h-4" />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="px-5 py-3 bg-linear-to-r from-indigo-100 to-purple-100 rounded-xl text-sm font-bold text-indigo-700 border border-indigo-200">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Publications Grid */}
      <section>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-linear-to-br from-white to-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-5">
              <FileText className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-700 text-center">
              {searchTerm
                ? "No se encontraron publicaciones"
                : "No hay publicaciones"}
            </h3>
            <p className="text-sm text-gray-600 mt-3 text-center max-w-md font-medium">
              {searchTerm
                ? "Intenta con otro término de búsqueda"
                : "Tus publicaciones aparecerán aquí una vez que el administrador las cree."}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-5 md:gap-6">
              {paginatedItems.map((pub) => (
                <PublicationCard
                  key={pub.id}
                  pub={pub}
                  onViewMedia={handleViewMedia}
                  onShareWhatsApp={handleWhatsAppShare}
                  onDownload={handleDownload}
                />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              totalItems={filtered.length}
              label="publicaciones"
            />
          </>
        )}
      </section>

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
