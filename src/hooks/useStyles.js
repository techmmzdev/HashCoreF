import { useMemo } from "react";

export const useInputStyles = (options = {}) => {
  const {
    hasIcon = false,
    hasError = false,
    size = "md",
    variant = "default",
  } = options;

  const styles = useMemo(() => {
    // Clases base comunes
    const baseClasses =
      "w-full border rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    // Clases de color y tema
    const colorClasses =
      "bg-white text-gray-900 placeholder-gray-400";

    // Clases de focus
    const focusClasses =
      "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none";

    // Clases de tamaño
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-4 py-3 text-base",
    };

    // Clases de borde según estado
    const borderClasses = hasError
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "border-gray-300";

    // Padding adicional si tiene icono
    const iconPadding = hasIcon ? "pl-10" : "";

    // Variantes específicas
    const variantClasses = {
      default: "",
      outline: "bg-transparent",
      filled: "bg-gray-50 border-transparent",
    };

    return {
      // Input principal
      input: `${baseClasses} ${colorClasses} ${focusClasses} ${sizeClasses[size]} ${borderClasses} ${iconPadding} ${variantClasses[variant]}`,

      // Contenedor del input con icono
      container: "relative",

      // Icono
      icon: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
      iconElement: "w-5 h-5 text-gray-400",

      // Label
      label: "block text-sm font-medium text-gray-700 mb-2",
      labelRequired: "text-red-500",

      // Error message
      error: "mt-1 text-xs text-red-600",

      // Select específico
      select: `${baseClasses} ${colorClasses} ${focusClasses} ${sizeClasses[size]} ${borderClasses} appearance-none`,

      // Textarea específico
      textarea: `${baseClasses} ${colorClasses} ${focusClasses} px-4 py-3 ${borderClasses} resize-vertical min-h-[100px]`,

      // Checkbox
      checkbox: "w-5 h-5 accent-indigo-600 rounded",

      // Radio
      radio:
        "w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 focus:ring-indigo-500 focus:ring-2",
    };
  }, [hasIcon, hasError, size, variant]);

  return styles;
};

/**
 * Hook para estilos de botones reutilizables
 */
export const useButtonStyles = (options = {}) => {
  const {
    variant = "primary",
    size = "md",
    fullWidth = false,
    loading = false,
  } = options;

  const styles = useMemo(() => {
    const baseClasses =
      "font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2.5 text-sm",
      lg: "px-6 py-3 text-base",
    };

    const variantClasses = {
      primary:
        "text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
      secondary:
        "text-gray-700 bg-gray-100 border border-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
      danger:
        "text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2",
      success:
        "text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
      outline:
        "text-indigo-600 border border-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    };

    const widthClasses = fullWidth ? "w-full" : "w-auto";

    return {
      button: `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses}`,
      loading: loading,
      spinner:
        "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin",
    };
  }, [variant, size, fullWidth, loading]);

  return styles;
};
