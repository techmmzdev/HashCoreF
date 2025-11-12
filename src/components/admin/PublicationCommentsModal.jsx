/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { commentService } from "@/services/comment";
import toast from "react-hot-toast";
import { Send, MessageSquare, Trash2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ConfirmationModal from "@/components/common/ConfirmationModal.jsx";
import { useSimpleModal } from "../../hooks/useModal";
import { Button } from "../common/UIComponents";

const PublicationCommentsModal = ({
  isOpen,
  onClose,
  publication,
  readOnly = false,
}) => {
  // Determinamos publicationId de forma segura para poder llamar hooks siempre
  const publicationId = publication?.id ?? null;
  const title = publication?.title ?? "Publicación";

  // Hook para modal con scroll blocking y ESC handling
  const { modalRef, handleBackdropClick, handleContentClick } = useSimpleModal({
    isOpen,
    onClose: () => {
      // Solo cerrar si no hay modal de confirmación abierto
      if (!isConfirmingDelete) {
        onClose();
      }
    },
  });

  // Estados locales para manejar comentarios sin usar hooks externos
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const [newComment, setNewComment] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const [commentToDelete, setCommentToDelete] = useState(null);

  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadComments = async () => {
    if (!publicationId) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const data = await commentService.getComments(publicationId);
      // el servicio devuelve un array de comentarios
      setComments(Array.isArray(data) ? data : data?.comments ?? []);
    } catch (err) {
      console.error("Error fetching comments:", err);
      setIsError(true);
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

  // Si el modal está cerrado o no hay publicación, renderizamos null pero
  // después de haber llamado a los hooks (cumplir regla de Hooks)
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
      toast.success("Comentario enviado.");
    } catch (err) {
      console.error("Error al enviar comentario:", err);
      toast.error("No se pudo enviar el comentario.");
    } finally {
      setIsCreating(false);
    }
  };

  const openConfirmModal = (commentId) => {
    const comment = comments.find((c) => c.id === commentId);

    setCommentToDelete(comment);
    setDeletingId(commentId); // Marca el elemento para el spinner
    setIsConfirmingDelete(true); // Muestra el modal
  };

  const handleConfirmDelete = async () => {
    if (!commentToDelete) return; // Seguridad
    setIsDeleting(true);
    try {
      await commentService.deleteComment(publicationId, commentToDelete.id);
      await loadComments();
      toast.success("Comentario eliminado.");
    } catch (err) {
      console.error("Error al eliminar el comentario:", err);
      toast.error("No se pudo eliminar el comentario.");
    } finally {
      setIsDeleting(false);
      closeConfirmModal();
    }
  };

  const closeConfirmModal = () => {
    setIsConfirmingDelete(false);
    setDeletingId(null);
    setCommentToDelete(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Modal Principal de Comentarios */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={handleContentClick}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Comentarios
                    </h2>
                    <p className="text-sm text-gray-500">
                      {title}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="p-2 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Lista de Comentarios */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-2" />
                    <p className="text-gray-500">
                      Cargando comentarios...
                    </p>
                  </div>
                ) : isError ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-red-500 font-semibold">
                      Error al cargar los comentarios
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Intenta de nuevo más tarde
                    </p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
                    <p className="text-gray-500 text-center">
                      Sé el primero en comentar 🚀
                    </p>
                  </div>
                ) : (
                  comments.map((comment) => {
                    const isCurrentDeleting = deletingId === comment.id;
                    return (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-gray-50 rounded-xl relative"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-semibold text-indigo-600">
                                {comment.user?.name?.charAt(0)?.toUpperCase() ||
                                  "?"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {comment.user?.name || "Usuario"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  comment.created_at
                                ).toLocaleDateString("es-ES", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {comment.user?.role === "ADMIN" && (
                              <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">
                                Admin
                              </span>
                            )}
                            {!readOnly && (
                              <Button
                                onClick={() => openConfirmModal(comment.id)}
                                disabled={isDeleting || isCurrentDeleting}
                                variant="ghost"
                                size="sm"
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                                title="Eliminar comentario"
                              >
                                {isCurrentDeleting ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 ml-10">
                          {comment.comment}
                        </p>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Formulario para Nuevo Comentario */}
              <div className="p-5 border-t border-gray-200 bg-gray-50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    disabled={isCreating}
                    maxLength={500}
                  />
                  <Button
                    type="submit"
                    disabled={isCreating || !newComment.trim()}
                    variant="primary"
                    className="px-4 py-2.5"
                    icon={
                      isCreating ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )
                    }
                  >
                    <span className="hidden sm:inline">Enviar</span>
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>

          {/* Modal de Confirmación */}
          <ConfirmationModal
            isOpen={isConfirmingDelete}
            onClose={closeConfirmModal}
            onConfirm={handleConfirmDelete}
            user={commentToDelete?.user}
            title="Eliminar Comentario"
            message={`¿Estás seguro de que deseas eliminar este comentario? El texto es: "${commentToDelete?.comment}". Esta acción no se puede deshacer.`}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default PublicationCommentsModal;
