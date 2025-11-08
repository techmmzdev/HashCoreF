import { useState, useEffect, useCallback, memo, useMemo } from "react";
import {
  X,
  FileText,
  Printer,
  Image as ImageIcon,
  Video,
  Loader2,
  AlertCircle,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { mediaService } from "@/services/media";
import { useSimpleModal } from "@/hooks/useModal";
import { Button } from "@/components/common/UIComponents";
import { getMediaUrl } from "@/config/urls"; // Usar función centralizada

// Función optimizada de formateo de fechas (movida fuera del componente)
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
};

const ClientInfoSection = memo(({ client }) => {
  const fields = useMemo(() => {
    if (!client) return [];
    return [
      { label: "Representante", value: client.user?.name || "N/A" },
      { label: "Empresa", value: client.company_name || "N/A" },
      { label: "Plan", value: client.plan || "N/A" },
      {
        label: "Email",
        value: client.user?.email || client.contact_email || "N/A",
      },
    ];
  }, [client]);

  if (!client) return null;

  return (
    <section className="bg-linear-to-br from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-lg p-5 border border-indigo-200 dark:border-indigo-800">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
        Información del Cliente
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {fields.map((field, idx) => (
          <div key={idx} className="space-y-1">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {field.label}
            </span>
            <p className="text-gray-600 dark:text-gray-400 break-word">
              {field.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});

ClientInfoSection.displayName = "ClientInfoSection";

const PublicationDetailSection = memo(({ publication }) => {
  const fields = useMemo(() => {
    if (!publication) return [];
    return [
      { label: "Título", value: publication.title || "Sin título", span: true },
      { label: "Tipo de Contenido", value: publication.content_type || "N/A" },
      { label: "Estado", value: publication.status || "N/A" },
      {
        label: "Fecha de Publicación",
        value: formatDate(publication.publish_date),
      },
    ];
  }, [publication]);

  if (!publication) return null;

  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-300 dark:border-gray-700 print:bg-white print:shadow-none">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        📋 Detalles de la Publicación
      </h2>

      <div className="space-y-5">
        {fields.map((field, idx) => (
          <div key={idx} className={field.span ? "sm:col-span-2" : ""}>
            <span className="block font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {field.label}
            </span>
            <p className="text-gray-700 dark:text-gray-400">{field.value}</p>
          </div>
        ))}

        {publication.content && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <span className="block font-semibold text-gray-800 dark:text-gray-200 mb-3">
              Contenido
            </span>
            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 whitespace-pre-line max-h-[300px] overflow-y-auto">
              {publication.content}
            </div>
          </div>
        )}
      </div>
    </section>
  );
});

PublicationDetailSection.displayName = "PublicationDetailSection";

const MediaItem = memo(({ media, index, isVideo, isReel, mediaUrl }) => {
  const [imageError, setImageError] = useState(false);

  // Tamaños optimizados como constantes
  const thumbHeight = useMemo(() => (isReel ? "180px" : "140px"), [isReel]);
  const thumbClass = useMemo(
    () => `w-full h-auto max-h-[${thumbHeight}] object-contain bg-black`,
    [thumbHeight]
  );

  // Detectar si está en modo impresión
  const isPrint =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("print").matches;

  return (
    <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600 bg-black shadow-md hover:shadow-lg transition-shadow duration-300 group min-h-[140px] max-h-[200px] flex items-center justify-center">
      {isReel && (
        <div
          className="print:flex hidden w-full h-full items-center justify-center text-center px-3"
          style={{ height: thumbHeight }}
        >
          <div className="flex flex-col items-center justify-center text-gray-500 text-xs leading-relaxed">
            <AlertCircle className="mb-2 h-6 w-6 text-gray-400" />
            <span className="max-w-[80%]">
              No se puede mostrar el video en el reporte impreso.
            </span>
          </div>
        </div>
      )}
      {/* Vista normal */}
      {!isPrint && (
        <>
          {isVideo && !isReel ? (
            <video
              src={mediaUrl}
              controls
              className={thumbClass}
              style={{ height: thumbHeight }}
              playsInline
              onError={() => setImageError(true)}
            />
          ) : isReel ? (
            <div
              className={`w-full min-h-[${thumbHeight}] flex items-center justify-center relative overflow-hidden bg-linear-to-br from-purple-500 to-pink-500`}
              style={{ height: thumbHeight }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="text-center text-white p-2 relative z-10">
                <Video className="w-8 h-8 mx-auto mb-2 opacity-90 animate-pulse" />
                <p className="text-xs font-bold">VIDEO</p>
              </div>
            </div>
          ) : imageError ? (
            <div className={`w-full`} style={{ height: thumbHeight }}>
              <AlertCircle className="h-6 w-6 text-gray-400 mx-auto" />
            </div>
          ) : (
            <img
              src={mediaUrl}
              alt={media.name || `media-${index}`}
              className={thumbClass}
              style={{ height: thumbHeight }}
              loading="lazy"
              onError={() => setImageError(true)}
            />
          )}
        </>
      )}
    </div>
  );
});

MediaItem.displayName = "MediaItem";

const ReportModal = ({ open, onClose, publication, client }) => {
  const [mediaList, setMediaList] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  // Usar el hook personalizado para modal
  const { modalRef, handleBackdropClick, handleContentClick } = useSimpleModal({
    isOpen: open,
    onClose,
  });

  // Cargar media
  useEffect(() => {
    if (!open || !publication?.id) {
      setMediaList([]);
      return;
    }

    const fetchMedia = async () => {
      setLoadingMedia(true);
      try {
        const data = await mediaService.getMedia(publication.id);
        setMediaList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error cargando media:", err);
        toast.error("Error al cargar archivos multimedia.");
        setMediaList([]);
      } finally {
        setLoadingMedia(false);
      }
    };

    fetchMedia();
  }, [open, publication?.id]);

  const handlePrint = useCallback(() => {
    setTimeout(() => window.print(), 200);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn print:backdrop-blur-0"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        onClick={handleContentClick}
        className="report-print-container bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col print:max-h-none print:overflow-visible print:shadow-none print:rounded-none print:bg-white animate-slideUp"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-linear-to-r from-gray-50 to-transparent dark:from-gray-700/50 dark:to-transparent">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Reporte de Publicación
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1.5 rounded-full print:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <ClientInfoSection client={client} />
          <PublicationDetailSection publication={publication} />

          {/* Multimedia */}
          <section className="bg-gray-50 dark:bg-gray-800 rounded-lg p-5 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Multimedia
            </h3>
            {loadingMedia ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Cargando archivos multimedia...
                </p>
              </div>
            ) : mediaList.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-10 flex flex-col items-center justify-center">
                <Video className="w-10 h-10 mb-2 text-gray-400 dark:text-gray-600 opacity-50" />
                <p className="text-sm">No hay multimedia asociada.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediaList.map((m, idx) => {
                  const isVideo = m.media_type?.startsWith("video");
                  const isReel =
                    publication?.content_type?.toUpperCase() === "REEL";
                  const mediaUrl = getMediaUrl(m.url);

                  return (
                    <MediaItem
                      key={m.id || idx}
                      media={m}
                      index={idx}
                      isVideo={isVideo}
                      isReel={isReel}
                      mediaUrl={mediaUrl}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-end gap-3 print:hidden">
          <Button onClick={onClose} variant="secondary">
            Cerrar
          </Button>
          <Button
            onClick={handlePrint}
            variant="primary"
            icon={<Printer className="h-4 w-4" />}
          >
            Imprimir
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
