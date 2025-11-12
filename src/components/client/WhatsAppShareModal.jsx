/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { X, Send, Copy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { WhatsAppModalSkeleton } from "@/components/common/Skeleton";

// Componente de ícono de WhatsApp personalizado
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const WhatsAppShareModal = ({ isOpen, onClose, publication }) => {
  const [customMessage, setCustomMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Limpiar mensaje cuando se abre/cierra el modal
  useEffect(() => {
    if (isOpen) {
      setCustomMessage("");
      setShowPreview(false);
    }
  }, [isOpen]);

  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!publication) return null;

  // Construir el mensaje final
  const buildFinalMessage = () => {
    const publicationTitle = publication.title || "Sin título";
    const userMessage = customMessage.trim();

    if (!userMessage) {
      return ""; // No mostrar mensaje si está vacío
    }

    let finalMessage = `*Comentario sobre: ${publicationTitle}*\n\n`;
    finalMessage += `${userMessage}\n\n`;
    finalMessage += `---\n`;
    finalMessage += `${new Date(publication.publish_date).toLocaleDateString(
      "es-ES",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    )}\n`;
    finalMessage += `Enviado desde HashCore`;

    return finalMessage;
  };

  // Mostrar vista previa antes de enviar
  const handleShowPreview = () => {
    if (!customMessage.trim()) {
      toast.error("Escribe un comentario antes de continuar");
      return;
    }
    setShowPreview(true);
  };

  // Cancelar vista previa y volver al formulario
  const handleCancelPreview = () => {
    setShowPreview(false);
  };

  // Abrir WhatsApp con el mensaje
  const handleSendToWhatsApp = () => {
    try {
      setIsLoading(true);

      const message = buildFinalMessage();
      // Codificación simple para WhatsApp
      const encodedMessage = encodeURIComponent(message);

      // URL para WhatsApp Web
      const whatsappUrl = `https://wa.me/949335641?text=${encodedMessage}`;

      // Abrir en nueva ventana
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");

      toast.success("¡Comentario enviado! WhatsApp se abrió correctamente");

      // Cerrar modal después de un breve delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error al abrir WhatsApp:", error);
      toast.error("Error al abrir WhatsApp. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copiar mensaje al portapapeles
  const handleCopyMessage = async () => {
    try {
      const message = buildFinalMessage();
      await navigator.clipboard.writeText(message);
      toast.success("Mensaje copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar:", error);
      toast.error("No se pudo copiar el mensaje");
    }
  };

  // Manejar tecla Enter para continuar (solo en desktop)
  const handleKeyPress = (e) => {
    // Solo permitir el atajo de teclado en dispositivos no táctiles
    if (
      e.key === "Enter" &&
      (e.ctrlKey || e.metaKey) &&
      !("ontouchstart" in window)
    ) {
      e.preventDefault();
      if (customMessage.trim() && !showPreview) {
        handleShowPreview();
      }
    }
  };

  const finalMessage = buildFinalMessage();
  const maxChars = 400; // Límite para comentarios

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-lg lg:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-linear-to-r from-green-50 to-emerald-50 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg sm:rounded-xl shrink-0">
                  <WhatsAppIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    Comentar Publicación
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    Envía tu opinión por WhatsApp
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors shrink-0 touch-manipulation"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </button>
            </div>
            {/* Body */}
            <div className="p-3 sm:p-6 space-y-3 sm:space-y-4 flex-1 overflow-y-auto scrollbar-hide min-h-0">
              {!showPreview ? (
                <>
                  {/* Instrucción clara */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h4 className="font-semibold text-blue-800 mb-1 sm:mb-2 text-sm sm:text-base">
                      💭 Comparte tu opinión
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                      Escribe tu comentario o feedback sobre la publicación{" "}
                      <strong className="wrap-break-word">
                        "{publication.title || "Sin título"}".
                      </strong>
                    </p>
                  </div>

                  {/* Campo de comentario */}
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
                      Tu comentario:
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Escribe tu opinión, comentarios o sugerencias sobre esta publicación..."
                      className="w-full h-32 sm:h-36 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none transition-all touch-manipulation scrollbar-hide"
                      maxLength={400}
                      required
                    />
                    <div className="flex justify-between items-center mt-2 text-xs sm:text-sm">
                      <span className="text-gray-400">
                        {customMessage.length}/400 caracteres
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                // Vista previa de confirmación
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                      ✅ Confirmar envío
                    </h4>
                    <p className="text-xs sm:text-sm text-green-700">
                      Este mensaje se enviará por WhatsApp al administrador o
                      editor de la empresa. Revisa que esté correcto:
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4">
                    <h5 className="font-medium text-gray-700 mb-3 text-sm">
                      Mensaje a enviar:
                    </h5>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto scrollbar-hide">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans wrap-break-word">
                        {buildFinalMessage()}
                      </pre>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs sm:text-sm text-amber-700 flex items-start gap-2">
                      <span>💡</span>
                      <span>
                        Se abrirá WhatsApp con este mensaje prellenado para
                        enviarlo al contacto de la empresa.
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 sm:gap-3 p-3 sm:p-6 border-t border-gray-200 bg-gray-50 shrink-0 sm:flex-row">
              {!showPreview ? (
                // Botones del formulario
                <>
                  <button
                    onClick={onClose}
                    className="w-full sm:flex-1 px-4 py-3 sm:py-3 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium touch-manipulation"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleShowPreview}
                    disabled={!customMessage.trim()}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-3 text-sm sm:text-base bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-all font-medium shadow-lg hover:shadow-xl touch-manipulation"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {customMessage.trim()
                        ? "Continuar"
                        : "Escribe un comentario"}
                    </span>
                    <span className="sm:hidden">
                      {customMessage.trim() ? "Continuar" : "Escribir"}
                    </span>
                  </button>
                </>
              ) : (
                // Botones de la vista previa
                <>
                  <button
                    onClick={handleCancelPreview}
                    className="w-full sm:flex-1 px-4 py-3 sm:py-3 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-medium touch-manipulation"
                  >
                    ← Volver a editar
                  </button>
                  <button
                    onClick={handleSendToWhatsApp}
                    disabled={isLoading}
                    className="w-full sm:flex-1 flex items-center justify-center gap-2 px-4 py-3 sm:py-3 text-sm sm:text-base bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl transition-all font-medium shadow-lg hover:shadow-xl touch-manipulation relative overflow-hidden"
                  >
                    {isLoading && (
                      <div className="absolute inset-0 bg-linear-to-r from-green-600 to-emerald-600 opacity-90">
                        <div
                          className="w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-pulse"
                          style={{ animation: "shimmer 1.5s infinite" }}
                        />
                      </div>
                    )}
                    <div className="relative z-10 flex items-center justify-center gap-2">
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span className="hidden sm:inline">
                            Abriendo WhatsApp...
                          </span>
                          <span className="sm:hidden">Enviando...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span className="hidden sm:inline">
                            Enviar por WhatsApp
                          </span>
                          <span className="sm:hidden">Enviar</span>
                        </>
                      )}
                    </div>
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppShareModal;
