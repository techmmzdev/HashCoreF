/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import OptimizedImage from "./OptimizedImage";
import Logo from "../../assets/logo.png";
import LogoWebp from "../../assets/logo.webp";

const SplashScreen = ({ onFinish }) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let logoTimeout, loaderTimeout, interval;

    // Mostrar logo por 1.5 segundos
    logoTimeout = setTimeout(() => {
      setShowLogo(false);

      loaderTimeout = setTimeout(() => {
        setShowLoader(true);

        setTimeout(() => {
          onFinish && onFinish();
        }, 2000);
      }, 300);
    }, 1500);

    return () => {
      if (logoTimeout) clearTimeout(logoTimeout);
      if (loaderTimeout) clearTimeout(loaderTimeout);
      if (interval) clearInterval(interval);
    };
  }, [onFinish]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Patrón de puntos de fondo - más visible con blanco */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #FFFFFF 1px, transparent 1px)",
            backgroundSize: "30px 30px", // Más pequeño para móvil
          }}
        ></div>
      </div>
      {/* Overlay con gradiente */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-black/60"></div>

      {/* Contenido del splash - con padding para móvil */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Logo animado - responsive */}
        {showLogo && (
          <motion.div
            className="w-48 h-48 sm:w-60 sm:h-60 md:w-64 md:h-64 drop-shadow-2xl"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <OptimizedImage
              src={Logo}
              webpSrc={LogoWebp}
              alt="Logo HASHTAGPERÚ"
              className="w-full h-full object-contain"
              priority={true} // Splash screen es lo primero que se ve
              lazy={false}
            />
          </motion.div>
        )}

        {/* Loader con círculo - responsive */}
        {showLoader && (
          <>
            <motion.div
              className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              {/* Círculo giratorio */}
              <motion.div
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-3 sm:border-4 border-l-transparent border-t-transparent border-[#F97316] flex items-center justify-center"
                style={{
                  borderTopColor: "transparent",
                  borderLeftColor: "transparent",
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              >
                {/* Logo pequeño giratorio centrado */}
                <motion.img
                  src={Logo}
                  alt="Loading"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Texto de carga - responsive */}
            <motion.div
              className="mt-6 sm:mt-8 text-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <p className="text-white/90 text-sm sm:text-base font-medium">
                Cargando portal...
              </p>
              <div className="flex justify-center mt-2 space-x-1">
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F97316] rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F97316] rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                />
                <motion.div
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#F97316] rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
