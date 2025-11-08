import { useEffect, useCallback, useRef } from "react";

export const useModal = (isOpen, onClose, options = {}) => {
  // Validación de parámetros
  if (typeof onClose !== "function") {
    console.warn(
      "useModal: onClose debe ser una función, recibido:",
      typeof onClose
    );
    onClose = () => {}; // función vacía como fallback
  }

  const {
    blockScroll = true,
    closeOnEscape = true,
    autoFocus = true,
    focusDelay = 100,
    preventCloseOnLoading = false,
    isLoading = false,
  } = options;

  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // 🔒 Bloqueo de scroll del body
  useEffect(() => {
    if (!blockScroll) return;

    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = prevOverflow;
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen, blockScroll]);

  // ⌨️ Cerrar con ESC
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && (!preventCloseOnLoading || !isLoading)) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, closeOnEscape, preventCloseOnLoading, isLoading]);

  // 🎯 Focus automático
  useEffect(() => {
    if (!autoFocus || !isOpen) return;

    const timer = setTimeout(() => {
      firstInputRef.current?.focus();
    }, focusDelay);

    return () => clearTimeout(timer);
  }, [isOpen, autoFocus, focusDelay]);

  // 📱 Handler para backdrop click
  const handleBackdropClick = useCallback(
    (e) => {
      if (
        e.target === e.currentTarget &&
        (!preventCloseOnLoading || !isLoading)
      ) {
        onClose();
      }
    },
    [onClose, preventCloseOnLoading, isLoading]
  );

  // 🚫 Handler para prevenir propagación
  const handleContentClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return {
    modalRef,
    firstInputRef,
    handleBackdropClick,
    handleContentClick,
  };
};

/**
 * Hook simplificado para modales básicos
 */
export const useSimpleModal = ({ isOpen, onClose }) => {
  return useModal(isOpen, onClose, {
    blockScroll: true,
    closeOnEscape: true,
    autoFocus: false,
  });
};

/**
 * Hook para formularios en modales
 */
export const useFormModal = ({ isOpen, onClose, isLoading = false }) => {
  return useModal(isOpen, onClose, {
    blockScroll: true,
    closeOnEscape: true,
    autoFocus: true,
    preventCloseOnLoading: true,
    isLoading,
  });
};
