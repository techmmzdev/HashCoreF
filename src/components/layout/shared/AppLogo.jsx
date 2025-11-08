import OptimizedImage from "@/components/common/OptimizedImage";
import logoImage from "@/assets/logo.png";
import logoWebp from "@/assets/logo.webp";

const AppLogo = ({ size = "normal", className = "", variant = "sidebar" }) => {
  const containerSize = size === "small" ? "w-8 h-8" : "w-10 h-10";
  const logoSize = size === "small" ? "w-6 h-6" : "w-8 h-8";

  // Diferentes estilos según donde se use
  const getContainerClasses = () => {
    if (variant === "mobile") {
      // Para móvil: fondo más neutro que no afecte los colores del logo
      return `${containerSize} rounded-lg bg-gray-100/10 dark:bg-gray-800/20 flex items-center justify-center hover:bg-gray-200/20 dark:hover:bg-gray-700/30 transition-colors`;
    }
    // Para sidebar: estilo original
    return `${containerSize} rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors`;
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <OptimizedImage
        src={logoImage}
        webpSrc={logoWebp}
        alt="HashTagPe Logo"
        className={`${logoSize} object-contain`}
        priority={true} // Logo es crítico para First Paint
        lazy={false}
      />
    </div>
  );
};

export default AppLogo;
