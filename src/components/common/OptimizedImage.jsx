import { useState } from "react";

const OptimizedImage = ({
  src,
  webpSrc,
  alt,
  className = "",
  fallback = "/placeholder-image.png",
  lazy = true,
  priority = false,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Si no hay webpSrc, usar imagen normal optimizada
  if (!webpSrc) {
    return (
      <img
        src={hasError ? fallback : src}
        alt={alt}
        className={`${className} ${
          !isLoaded ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : lazy ? "lazy" : "eager"}
        {...props}
      />
    );
  }

  // Con soporte WebP usando <picture>
  return (
    <picture
      className={`block ${
        !isLoaded ? "opacity-0" : "opacity-100"
      } transition-opacity duration-300`}
    >
      {/* Formato WebP para navegadores modernos */}
      <source srcSet={webpSrc} type="image/webp" />

      {/* Fallback para navegadores que no soportan WebP */}
      <img
        src={hasError ? fallback : src}
        alt={alt}
        className={className}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : lazy ? "lazy" : "eager"}
        {...props}
      />
    </picture>
  );
};

export default OptimizedImage;
