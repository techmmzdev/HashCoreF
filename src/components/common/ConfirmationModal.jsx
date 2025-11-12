import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2, X } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading = false,
  variant = "danger", // 'danger' | 'warning' | 'info'
}) => {
  const modalRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !isLoading) onClose();
    };

    const handleTab = (event) => {
      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements.length) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("keydown", handleTab);

      // Focus cancel button on open
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 100);

      // Block scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.removeEventListener("keydown", handleTab);
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  // Variant styles
  const variantStyles = {
    danger: {
      icon: "bg-red-100",
      iconColor: "text-red-600",
      button:
        "bg-red-600 hover:bg-red-700",
      ring: "focus:ring-red-500",
    },
    warning: {
      icon: "bg-amber-100",
      iconColor: "text-amber-700",
      button:
        "bg-amber-600 hover:bg-amber-700",
      ring: "focus:ring-amber-500",
    },
    info: {
      icon: "bg-blue-100",
      iconColor: "text-blue-600",
      button:
        "bg-blue-600 hover:bg-blue-700",
      ring: "focus:ring-blue-500",
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-3 sm:p-4"
      aria-modal="true"
      role="dialog"
      onClick={!isLoading ? onClose : undefined}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-200 ease-out"
        onClick={(e) => e.stopPropagation()}
        role="document"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Header */}
        <div className="p-4 sm:p-6 pb-3 sm:pb-4">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Icon */}
            <div
              className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full ${styles.icon} flex items-center justify-center`}
            >
              <AlertTriangle
                className={`w-5 h-5 sm:w-6 sm:h-6 ${styles.iconColor}`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 pt-0.5 sm:pt-1 min-w-0">
              <h2
                id="modal-title"
                className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 wrap-break-word"
              >
                {title}
              </h2>
              <p
                id="modal-description"
                className="text-xs sm:text-sm text-gray-600 leading-relaxed wrap-break-word"
              >
                {message ||
                  "¿Estás seguro de que deseas realizar esta acción? Esta acción no se puede deshacer."}
              </p>
            </div>

            {/* Close button */}
            {!isLoading && (
              <button
                onClick={onClose}
                className="shrink-0 p-1 sm:p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Cerrar modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-1 sm:pt-2 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3">
          <button
            ref={cancelButtonRef}
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 text-sm font-semibold text-white rounded-lg focus:outline-none focus:ring-2 ${styles.ring} focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles.button} inline-flex items-center justify-center gap-2 min-w-[100px]`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
