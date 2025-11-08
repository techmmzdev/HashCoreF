import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Shield, Zap, ArrowRight, Users } from "lucide-react";
import OptimizedImage from "@/components/common/OptimizedImage";
import logo from "@/assets/logo.png";
import logoWebp from "@/assets/logo.webp";

// Constantes extraídas para mejor rendimiento
const ANIMATION_DELAYS = {
  second: "0.1s",
  third: "0.2s",
};

// Configuración de trust indicators (evita duplicación)
const TRUST_INDICATORS = [
  {
    color: "bg-green-500",
    text: "Sistema disponible 24/7",
    animated: true,
  },
  {
    color: "bg-brand-orange",
    text: "Datos en tiempo real",
    animated: false,
  },
  {
    color: "bg-blue-500",
    text: "Soporte técnico incluido",
    animated: false,
  },
];

// Configuración de features
const FEATURES = [
  {
    icon: Zap,
    title: "Gestión de Contenido",
    description:
      "Revisa y aprueba tus publicaciones antes de que salgan al aire. Control total sobre tu presencia digital.",
  },
  {
    icon: Shield,
    title: "Métricas y Analytics",
    description:
      "Visualiza el rendimiento de tus campañas con reportes detallados y métricas en tiempo real de tu ROI.",
  },
  {
    icon: Users,
    title: "Comunicación Directa",
    description:
      "Mantente conectado con tu equipo de marketing a través de comentarios y notificaciones en tiempo real.",
  },
];

// Información de contacto
const CONTACT_INFO = [
  { title: "📍 Ubicación", content: "Calle Tizón S/N" },
  { title: "🏢 Empresa", content: "RUC: 20614080095" },
  { title: "👤 Representante", content: "Christian Flores Flores" },
  {
    title: "📞 Contacto",
    content: [
      {
        type: "whatsapp",
        text: "📱 949335641",
        href: "https://wa.me/51949335641",
      },
      {
        type: "email",
        text: "✉️ Christianif.flores@gmail.com",
        href: "mailto:Christianif.flores@gmail.com",
      },
    ],
  },
];

const HomePage = memo(() => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-black text-slate-900 dark:text-white transition-colors duration-300">
      {/* Navbar */}
      <nav className="border-b border-slate-300/50 dark:border-slate-700/50 backdrop-blur-md sticky top-0 z-50 bg-slate-100/80 dark:bg-slate-900/80 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-3">
              <OptimizedImage
                src={logo}
                webpSrc={logoWebp}
                alt="Logo HashtagPerú"
                className="w-10 h-10 rounded-full border-2 border-brand-orange bg-white"
                priority={true} // Logo en navbar es visible immediately
                lazy={false}
              />
              <span className="text-xl md:text-2xl font-bold text-brand-orange tracking-wide">
                HASHTAGPERÚ
              </span>
            </div>
            <span className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-semibold">
              Marketing Digital & Comunicación Visual
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center mb-16 md:mb-20">
          <div className="order-2 lg:order-1">
            <div className="inline-block bg-brand-orange/10 border border-brand-orange/30 px-3 md:px-4 py-1.5 rounded-full mb-6">
              <span className="text-brand-orange text-xs md:text-sm font-semibold">
                ✨ Portal de gestión para clientes HASHTAGPERÚ
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-linear-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Accede a tu panel de
              <span className="text-brand-orange block mt-2">
                marketing digital
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed max-w-2xl">
              Inicia sesión para gestionar tus publicaciones, ver métricas en
              tiempo real, revisar el calendario de contenido y comunicarte
              directamente con tu equipo de marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                to="/login"
                className="group inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover px-8 py-4 rounded-xl font-semibold transition-all shadow-lg text-base text-white"
              >
                🚀 Iniciar Sesión
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="mailto:Christianif.flores@gmail.com"
                className="inline-flex items-center justify-center gap-2 border-2 border-slate-400/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:border-slate-500 dark:hover:border-slate-500 px-8 py-4 rounded-xl font-semibold transition-all backdrop-blur-sm text-base"
              >
                ❓ ¿Necesitas ayuda?
              </a>
            </div>

            {/* Stats or Trust Indicators */}
            <div className="flex flex-col sm:flex-row gap-6 text-sm text-slate-600 dark:text-slate-400">
              {TRUST_INDICATORS.map((indicator, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 ${indicator.color} rounded-full ${
                      indicator.animated ? "animate-pulse" : ""
                    }`}
                  ></div>
                  <span>{indicator.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative lg:block">
              <div className="absolute inset-0 bg-brand-orange/20 rounded-3xl blur-3xl opacity-40 animate-pulse"></div>
              <div className="relative bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300/50 dark:border-slate-600/50 rounded-3xl p-8 backdrop-blur-sm">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-orange rounded-full mb-6 shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-brand-orange">
                    Portal de Cliente
                  </h3>
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                    Dashboard completo con gestión de publicaciones, métricas
                    detalladas, calendario de contenido y comunicación directa
                    con tu equipo.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"
                        style={{ animationDelay: ANIMATION_DELAYS.second }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-brand-orange rounded-full animate-bounce"
                        style={{ animationDelay: ANIMATION_DELAYS.third }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          {FEATURES.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="group bg-slate-200/30 dark:bg-slate-800/30 border border-slate-300/50 dark:border-slate-700/50 rounded-2xl p-8 hover:border-brand-orange/50 transition-all duration-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-brand-orange/10 rounded-xl mb-6 group-hover:bg-brand-orange/20 transition-colors">
                  <IconComponent className="w-7 h-7 text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="relative mb-16 md:mb-20">
          <div className="absolute inset-0 bg-brand-orange/5 rounded-3xl blur-3xl"></div>
          <div className="relative bg-linear-to-r from-slate-200/60 dark:from-slate-800/60 to-slate-300/60 dark:to-slate-900/60 border border-slate-300/50 dark:border-slate-600/50 rounded-3xl p-12 lg:p-16 backdrop-blur-sm">
            <div className="text-center">
              <div className="inline-block bg-brand-orange/10 border border-brand-orange/30 px-4 py-2 rounded-full mb-6">
                <span className="text-brand-orange text-sm font-semibold">
                  🎯 ¿Nuevo en el sistema?
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-linear-to-r from-slate-900 dark:from-white to-slate-700 dark:to-slate-300 bg-clip-text text-transparent">
                Descubre todas las funciones
                <span className="text-brand-orange block mt-2">
                  de tu panel
                </span>
              </h2>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Explora tu dashboard personal, revisa publicaciones programadas,
                consulta métricas de rendimiento y mantente al día con tu
                estrategia digital.
              </p>

              {/* Enhanced CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover px-8 py-4 rounded-xl font-semibold transition-all shadow-lg text-base text-white"
                >
                  🚀 Ingresar al Sistema
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="mailto:Christianif.flores@gmail.com"
                  className="group inline-flex items-center justify-center gap-2 border-2 border-slate-300/50 dark:border-slate-600/50 text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-500 px-8 py-4 rounded-xl font-semibold transition-all backdrop-blur-sm text-base"
                >
                  🆘 Soporte Técnico
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-slate-600 dark:text-slate-400">
                {TRUST_INDICATORS.map((indicator, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 ${indicator.color} rounded-full ${
                        indicator.animated ? "animate-pulse" : ""
                      }`}
                    ></div>
                    <span>{indicator.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-300/50 dark:border-slate-700/50 py-12 bg-linear-to-b from-slate-100/80 dark:from-slate-900/80 to-slate-200 dark:to-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <OptimizedImage
                src={logo}
                webpSrc={logoWebp}
                alt="Logo HashtagPerú"
                className="w-8 h-8 rounded-full border-2 border-brand-orange bg-white"
                lazy={true} // Footer puede usar lazy loading
              />
              <span className="text-lg font-bold text-brand-orange">
                HASHTAGPERÚ
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Marketing Digital & Comunicación Visual
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-sm">
            {CONTACT_INFO.map((info, index) => (
              <div key={index} className="text-center md:text-left">
                <h4 className="text-slate-900 dark:text-white font-semibold mb-2">
                  {info.title}
                </h4>
                {Array.isArray(info.content) ? (
                  <div className="space-y-1">
                    {info.content.map((contact, contactIndex) => (
                      <p
                        key={contactIndex}
                        className="text-slate-600 dark:text-slate-400"
                      >
                        <a
                          href={contact.href}
                          target={
                            contact.type === "whatsapp" ? "_blank" : undefined
                          }
                          rel={
                            contact.type === "whatsapp"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-brand-orange hover:text-brand-orange-hover transition-colors"
                        >
                          {contact.text}
                        </a>
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 dark:text-slate-400">
                    {info.content}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-300/50 dark:border-slate-700/50 pt-6 text-center">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              © 2025 HASHTAGPERÚ. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
});

HomePage.displayName = "HomePage";

export default HomePage;
