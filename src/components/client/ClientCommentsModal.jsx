/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { commentService } from "@/services/comment";
import toast from "react-hot-toast";
import { Send, MessageSquare, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ClientCommentsModal = ({ isOpen, onClose, publication }) => {
  const publicationId = publication?.id ?? null;
  const title = publication?.title ?? "Publicación";

  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const loadComments = async () => {
    if (!publicationId) return;
    setIsLoading(true);
    try {
      const data = await commentService.getComments(publicationId);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al cargar comentarios:", err);
      toast.error("No se pudieron cargar los comentarios");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, publicationId]);

  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Bloquear scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !publication) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsCreating(true);
    try {
      await commentService.createComment(publicationId, {
        comment: newComment.trim(),
      });
      setNewComment("");
      await loadComments();
      toast.success("Comentario enviado correctamente");
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      toast.error("No se pudo enviar el comentario");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 sm:p-5 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-indigo-100 rounded-lg">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Comentarios
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 truncate max-w-[200px] sm:max-w-none">
                    {title}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
              </button>
            </div>

            {/* Lista de Comentarios */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-2 sm:space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 animate-spin mb-2" />
                  <p className="text-xs sm:text-sm text-gray-500">
                    Cargando comentarios...
                  </p>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 sm:py-12">
                  <MessageSquare className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300 mb-2 sm:mb-3" />
                  <p className="text-xs sm:text-sm text-gray-500 text-center px-4">
                    Sé el primero en comentar 🚀
                  </p>
                </div>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                          <span className="text-xs sm:text-sm font-semibold text-indigo-600">
                            {comment.user?.name?.charAt(0)?.toUpperCase() ||
                              "?"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                            {comment.user?.name || "Usuario"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString(
                              "es-ES",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                      {comment.user?.role === "ADMIN" && (
                        <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full shrink-0">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 ml-8 sm:ml-10">
                      {comment.comment}
                    </p>
                  </motion.div>
                ))
              )}
            </div>

            {/* Formulario para Nuevo Comentario */}
            <div className="p-3 sm:p-5 border-t border-gray-200 bg-gray-50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribe un comentario..."
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg bg-white text-sm sm:text-base text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  disabled={isCreating}
                  maxLength={500}
                />
                <button
                  type="submit"
                  disabled={isCreating || !newComment.trim()}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 touch-manipulation shrink-0"
                >
                  {isCreating ? (
                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                  <span className="hidden sm:inline">Enviar</span>
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ClientCommentsModal;
