import OptimizedImage from "@/components/common/OptimizedImage";
import logoImage from "@/assets/logo.png";
import logoWebp from "@/assets/logo.webp";

const AppLogo = ({ size = "normal", className = "", variant = "sidebar" }) => {
  // Tamaños más grandes y flexibles
  const containerSize =
    size === "small" ? "w-8 h-8" : size === "large" ? "w-24 h-16" : "w-12 h-12";

  const logoSize =
    size === "small"
      ? "w-6 h-6"
      : size === "large"
      ? "w-full h-full"
      : "w-10 h-10";

  // Diferentes estilos según donde se use
  const getContainerClasses = () => {
    if (variant === "mobile") {
      // Para móvil: fondo más neutro
      return `${containerSize} rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors`;
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
