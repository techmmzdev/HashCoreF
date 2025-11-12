/* eslint-disable no-unused-vars */
import { X, Play, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { getMediaUrl } from "@/config/urls";

const ClientMediaModal = ({ isOpen, onClose, publication }) => {
  // Listener para cerrar con ESC
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === "Escape" || e.key === "Esc") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !publication) return null;

  const media = publication.media?.[0];
  const mediaUrl = media ? getMediaUrl(media.url) : null;

  const isVideo =
    media?.media_type === "VIDEO" || media?.url?.match(/\.(mp4|mov|webm)$/i);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] rounded-xl sm:rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Botón de cierre */}
            <button
              onClick={onClose}
              aria-label="Cerrar"
              className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/80 text-gray-700 hover:bg-white transition-colors shadow-lg touch-manipulation"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header */}
            <div className="w-full px-3 sm:px-5 pt-3 sm:pt-5 text-center border-b border-gray-200 pb-2 sm:pb-3">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900">
                {publication.title || "Vista de publicación"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {publication.content_type === "REEL" ? (
                  <span className="flex items-center justify-center gap-1">
                    <Play className="w-3 h-3" /> Video (Reel)
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-1">
                    <ImageIcon className="w-3 h-3" /> Imagen (Post)
                  </span>
                )}
              </p>
            </div>

            {/* Contenido multimedia */}
            <div className="w-full flex-1 flex items-center justify-center bg-gray-900 p-2 sm:p-4 min-h-[300px] sm:min-h-[400px] overflow-auto">
              {mediaUrl ? (
                isVideo ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="max-h-[60vh] sm:max-h-[75vh] max-w-full rounded-lg sm:rounded-xl shadow-lg object-contain"
                    playsInline
                    autoPlay
                  />
                ) : (
                  <img
                    src={mediaUrl}
                    alt={media?.name || "media"}
                    className="max-h-[60vh] sm:max-h-[75vh] max-w-full rounded-lg sm:rounded-xl shadow-lg object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                )
              ) : (
                <div className="text-center text-gray-400 p-4">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-xs sm:text-sm">
                    Esta publicación no tiene contenido multimedia.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientMediaModal;
