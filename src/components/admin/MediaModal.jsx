import { useEffect, useState, useCallback, useRef } from "react";
import {
  X,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle,
  InfoIcon,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";
import { mediaService } from "@/services/media";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useSimpleModal } from "../../hooks/useModal";
import { Button } from "../common/UIComponents";
import { getMediaUrl } from "@/config/urls"; // Usar función centralizada

// === 🌀 Indicador de carga ===
const Loading = ({ message = "Cargando..." }) => (
  <div className="flex items-center justify-center py-4 text-gray-500">
    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
    <p className="text-sm">{message}</p>
  </div>
);

// === 🖼️ Previsualización de archivo multimedia ===
const MediaItemPreview = ({ media, handleDelete }) => {
  const isVideo = media.media_type.startsWith("video");
  const mediaUrl = getMediaUrl(media.url);

  return (
    <div className="relative w-full group">
      <div className="w-full rounded-lg overflow-hidden border-2 border-gray-300 bg-gray-100">
        {isVideo ? (
          <video
            src={mediaUrl}
            controls
            className="w-full h-auto max-h-[500px] object-contain"
            playsInline
            preload="none"
          />
        ) : (
          <img
            src={mediaUrl}
            alt="media"
            className="w-full h-auto max-h-[500px] object-contain"
            loading="lazy"
          />
        )}
      </div>

      <Button
        onClick={() => handleDelete(media.id)}
        variant="danger"
        size="sm"
        className="absolute top-3 right-3 p-2.5 rounded-full transition-all shadow-lg"
        style={{ opacity: 1, pointerEvents: "auto" }}
        title="Eliminar archivo"
      >
        <Trash2 className="w-5 h-5" />
      </Button>
    </div>
  );
};

// === 📦 Modal de gestión de material multimedia ===
const MediaModal = ({
  publicationId,
  publication,
  isOpen,
  onClose,
  onUploaded,
}) => {
  // Hook para modal con scroll blocking y ESC handling
  const { modalRef, handleBackdropClick, handleContentClick } = useSimpleModal({
    isOpen,
    onClose: () => {
      // Solo cerrar si no hay modal de confirmación abierto
      if (!isConfirmOpen) {
        onClose();
      }
    },
  });

  const [mediaList, setMediaList] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typeMismatch, setTypeMismatch] = useState(false);
  const fileInputRef = useRef(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState(null);

  // 🧹 Limpiar estado al cerrar modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setTypeMismatch(false);
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  }, [isOpen]);

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/webm",
  ];

  // 📥 Cargar material multimedia
  const fetchMedia = useCallback(async () => {
    if (!publicationId) return;
    try {
      setLoading(true);
      const data = await mediaService.getMedia(publicationId);
      setMediaList(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar material multimedia.");
    } finally {
      setLoading(false);
    }
  }, [publicationId]);

  useEffect(() => {
    if (isOpen && publicationId) fetchMedia();
  }, [isOpen, publicationId, fetchMedia]);

  // 📂 Manejo del archivo seleccionado
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !allowedTypes.includes(file.type)) {
      toast.error(
        "Tipo de archivo no válido. Solo se permiten imágenes o videos (mp4/webm)."
      );
      setSelectedFile(null);
      e.target.value = null;
      return;
    }

    if (publication?.content_type) {
      const pubType = publication.content_type.toUpperCase();
      const isVideo = file.type.startsWith("video");
      const isImage = file.type.startsWith("image");

      if (pubType === "REEL" && !isVideo) {
        toast.error("Esta publicación es un REEL — sube un video.");
        setTypeMismatch(true);
        e.target.value = null;
        return;
      }
      if (pubType === "POST" && !isImage) {
        toast.error("Esta publicación es un POST — sube una imagen.");
        setTypeMismatch(true);
        e.target.value = null;
        return;
      }
      setTypeMismatch(false);
    }

    setSelectedFile(file);
  };

  // 🚀 Subir archivo
  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Selecciona un archivo primero.");

    try {
      setLoading(true);

      const uploadPromise = mediaService.uploadMedia(
        publicationId,
        selectedFile
      );

      await toast.promise(uploadPromise, {
        loading: "Subiendo archivo...",
        success: (res) => res?.message || "Archivo subido correctamente. 🎉",
        error: (err) =>
          err?.response?.data?.message || "Error al subir el archivo.",
      });

      // Cerrar el modal después de una subida exitosa
      onClose?.();

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
      await fetchMedia();
      onUploaded?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Eliminar archivo
  const handleDelete = (mediaId) => {
    setMediaToDelete({ id: mediaId });
    setIsConfirmOpen(true);
  };

  const confirmDelete = async (id) => {
    if (!id) {
      setIsConfirmOpen(false);
      setMediaToDelete(null);
      return;
    }

    try {
      setLoading(true);
      await toast.promise(mediaService.deleteMedia(publicationId, id), {
        loading: "Eliminando archivo...",
        success: (res) =>
          res?.reverted || res?.publication
            ? "Archivo eliminado. La publicación se ha revertido a En Proceso."
            : "Archivo eliminado correctamente. 🗑️",
        error: (err) =>
          err?.response?.data?.message || "Error al eliminar el archivo.",
      });

      setIsConfirmOpen(false);
      setMediaToDelete(null);
      await fetchMedia();
      onUploaded?.();
      onClose?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isUploading = loading && selectedFile;
  const isFetchingMedia = loading && !selectedFile;
  const contentType = publication?.content_type
    ? publication.content_type.toUpperCase()
    : "";

  // 💡 Mensaje dinámico según el tipo de publicación
  const allowedFormatsMessage =
    contentType === "POST" ? (
      <>
        Solo se permiten <strong>imágenes (PNG, JPG, WEBP)</strong> para un{" "}
        {contentType}. Un archivo por publicación.
      </>
    ) : contentType === "REEL" ? (
      <>
        Solo se permiten <strong>videos (MP4, WEBM)</strong> para un{" "}
        {contentType}. Un archivo por publicación.
      </>
    ) : (
      <>
        Permitidos: <strong>imágenes (PNG, JPG, WEBP)</strong> o{" "}
        <strong>videos (MP4, WEBM)</strong>. Un archivo por publicación.
      </>
    );

  // Definir el accept dinámico según el tipo de publicación
  let acceptTypes = "image/*,video/mp4,video/webm";
  if (contentType === "POST") acceptTypes = "image/*";
  else if (contentType === "REEL") acceptTypes = "video/mp4,video/webm";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-3 py-4"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        onClick={handleContentClick}
        className="bg-white rounded-xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto"
      >
        {/* === Header === */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>Multimedia</span>
            {contentType && (
              <span className="text-xs font-semibold text-indigo-600 border border-indigo-500 rounded-full px-1.5 py-0.5">
                {contentType}
              </span>
            )}
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="p-1 rounded-full shrink-0"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* === Body === */}
        <div className="p-4 space-y-4">
          {/* --- Subida --- */}
          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="media-upload-input"
                className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all cursor-pointer shadow-md text-sm ${
                  mediaList.length > 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-70"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg"
                }`}
              >
                <UploadCloud className="w-4 h-4 shrink-0" />
                <span className="truncate flex-1 text-left">
                  {selectedFile ? selectedFile.name : "Seleccionar archivo"}
                </span>
                <input
                  id="media-upload-input"
                  type="file"
                  ref={fileInputRef}
                  accept={acceptTypes}
                  onChange={handleFileChange}
                  disabled={mediaList.length > 0 || isUploading}
                  className="hidden"
                />
              </label>

              <div className="flex gap-2 items-center">
                <Button
                  onClick={handleUpload}
                  disabled={
                    !selectedFile ||
                    loading ||
                    mediaList.length > 0 ||
                    typeMismatch
                  }
                  variant={
                    !selectedFile ||
                    loading ||
                    mediaList.length > 0 ||
                    typeMismatch
                      ? "secondary"
                      : "success"
                  }
                  size="sm"
                  className="px-4 py-2 shrink-0"
                  icon={
                    loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )
                  }
                >
                  {loading ? "Subiendo" : "Subir"}
                </Button>
              </div>
            </div>

            {typeMismatch && (
              <p className="text-xs text-yellow-700 flex items-start gap-1.5 bg-yellow-100 border border-yellow-300 rounded px-2 py-1.5">
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5 text-yellow-700" />
                <span>
                  El archivo no coincide con el tipo de publicación (
                  {contentType})
                </span>
              </p>
            )}

            {mediaList.length === 0 && (
              <p className="text-xs text-gray-600 flex items-start gap-1.5 bg-indigo-50 border border-indigo-200 rounded px-2 py-1.5">
                <InfoIcon className="w-3 h-3 shrink-0 mt-0.5 text-indigo-600" />
                <span>{allowedFormatsMessage}</span>
              </p>
            )}

            {mediaList.length > 0 && (
              <div className="flex items-start gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-3 py-2 rounded text-xs">
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                <p>Ya existe un archivo. Elimínalo para subir uno nuevo.</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200" />

          {/* --- Lista de media --- */}
          {isFetchingMedia ? (
            <Loading message="Cargando multimedia..." />
          ) : mediaList.length === 0 ? (
            <div className="text-gray-500 text-center py-6 flex flex-col items-center justify-center">
              <ImageIcon className="w-8 h-8 mb-1.5 text-gray-400" />
              <p className="text-sm">No hay material aún.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mediaList.map((m) => (
                <MediaItemPreview
                  key={m.id}
                  media={m}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setMediaToDelete(null);
        }}
        onConfirm={() => mediaToDelete && confirmDelete(mediaToDelete.id)}
        user={mediaToDelete}
        title="Eliminar archivo"
        message="¿Seguro que deseas eliminar este archivo? Esta acción no se puede deshacer."
      />
    </div>
  );
};

export default MediaModal;
