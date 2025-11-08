import React from "react";
import { useButtonStyles } from "@/hooks/useStyles";

/**
 * Componente Button reutilizable con múltiples variantes y estados
 */
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = "left",
  className = "",
  ...props
}) => {
  const styles = useButtonStyles({ variant, size, fullWidth, loading });

  const isDisabled = disabled || loading;

  const renderIcon = () => {
    if (loading) return <div className={styles.spinner} />;
    if (icon) return icon; // 👈 ahora puede ser un <Printer /> o cualquier JSX
    return null;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${styles.button} ${className}`}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && !loading && renderIcon()}
    </button>
  );
};

/**
 * Componente Modal Base reutilizable
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  footerClassName = "",
  footer,
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full mx-4",
  };

  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-h-[90vh] flex flex-col overflow-hidden ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div
            className={`flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}
          >
            {title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                aria-label="Cerrar modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`flex-1 overflow-y-auto p-6 ${bodyClassName}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            className={`border-t border-gray-200 dark:border-gray-700 p-6 ${footerClassName}`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Componente Loading Spinner reutilizable
 */
const Loading = ({ size = "md", message, center = true, className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const containerClasses = center
    ? "flex items-center justify-center"
    : "flex items-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin`}
      />
      {message && (
        <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
          {message}
        </span>
      )}
    </div>
  );
};

/**
 * Componente Card reutilizable
 */
const Card = ({
  children,
  title,
  subtitle,
  className = "",
  headerClassName = "",
  bodyClassName = "",
  padding = true,
  shadow = true,
  border = true,
}) => {
  const cardClasses = `
    bg-white dark:bg-gray-800 rounded-lg
    ${shadow ? "shadow-sm hover:shadow-md transition-shadow" : ""}
    ${border ? "border border-gray-200 dark:border-gray-700" : ""}
    ${className}
  `;

  return (
    <div className={cardClasses}>
      {(title || subtitle) && (
        <div
          className={`${
            padding ? "p-6" : ""
          } border-b border-gray-200 dark:border-gray-700 ${headerClassName}`}
        >
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className={`${padding ? "p-6" : ""} ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export { Button, Modal, Loading, Card };
