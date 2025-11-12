import React from "react";

// ============================================
// COMPONENTE BASE
// ============================================
const Skeleton = ({ className = "", animate = true, delay = 0 }) => {
  const delayStyle = delay > 0 ? { animationDelay: `${delay * 0.08}s` } : {};

  return (
    <div
      className={`skeleton-base ${animate ? "" : "bg-gray-200"} ${className}`}
      style={delayStyle}
      aria-hidden="true"
    />
  );
};

// ============================================
// DASHBOARD ADMIN - OPTIMIZADO PARA MOBILE
// ============================================
export const AdminDashboardSkeleton = () => (
  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
    {/* Header */}
    <div className="skeleton-fade-in mb-4 sm:mb-6">
      <Skeleton className="h-8 sm:h-9 lg:h-10 w-48 sm:w-56 rounded-lg" />
    </div>

    {/* Stats Grid - 4 cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-12 w-12 rounded-xl" delay={i} />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-3 w-20 rounded-lg" />
            </div>
          </div>
        ))}
    </div>

    {/* Charts Grid - 2 columnas */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
      {/* Chart 1 */}
      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-4">
        <Skeleton className="h-5 sm:h-6 w-48 sm:w-56 rounded-lg" />
        <Skeleton className="h-64 sm:h-72 lg:h-80 w-full rounded-lg" />
      </div>

      {/* Chart 2 */}
      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-4">
        <Skeleton className="h-5 sm:h-6 w-40 sm:w-48 rounded-lg" />
        <Skeleton className="h-64 sm:h-72 lg:h-80 w-full rounded-lg" />
      </div>
    </div>

    {/* Pie Chart + Recent Activity */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-4">
        <Skeleton className="h-5 sm:h-6 w-44 rounded-lg" />
        <div className="flex items-center justify-center">
          <Skeleton className="h-64 w-64 rounded-full" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-4">
        <Skeleton className="h-5 sm:h-6 w-36 rounded-lg" />
        <div className="space-y-3 max-h-80 overflow-hidden">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-2 w-2 rounded-full shrink-0" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-3 w-20 rounded-lg" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>

    {/* Additional Stats Row - 3 cards */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-lg p-5 sm:p-6 space-y-3"
          >
            <Skeleton className="h-4 w-32 rounded-lg" />
            <div className="space-y-2">
              {Array(3)
                .fill(0)
                .map((_, j) => (
                  <div key={j} className="flex justify-between items-center">
                    <Skeleton className="h-3 w-24 rounded-lg" />
                    <Skeleton className="h-4 w-8 rounded-lg" />
                  </div>
                ))}
            </div>
          </div>
        ))}
    </div>
  </div>
);

// ============================================
// DASHBOARD CLIENTE - OPTIMIZADO
// ============================================
export const ClientDashboardSkeleton = () => (
  <div className="space-y-4 sm:space-y-5 lg:space-y-6">
    {/* Welcome Card - Estilo simple con saludo */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
      <div className="space-y-3">
        {/* Saludo - ¡Hola, [Nombre]! */}
        <Skeleton className="h-8 sm:h-9 w-56 sm:w-64 rounded-lg" />
        {/* Subtítulo - Bienvenido... */}
        <Skeleton className="h-5 w-64 sm:w-80 rounded-lg" />
        {/* Badges: Plan + Nombre */}
        <div className="flex items-center gap-3 pt-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-3"
          >
            <Skeleton className="h-4 w-28 rounded-lg" delay={i} />
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-3 w-24 rounded-lg" />
          </div>
        ))}
    </div>

    {/* Recent Activity Card */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
      <Skeleton className="h-6 w-40 rounded-lg" />
      <div className="space-y-3">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-100"
            >
              <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-3 w-32 rounded-lg" />
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
);

// ============================================
// PÁGINA DE CLIENTES - OPTIMIZADO
// ============================================
export const ClientsTableSkeleton = () => (
  <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
    {/* Header */}
    <div className="skeleton-fade-in">
      <Skeleton className="h-7 sm:h-8 w-48 sm:w-56 mb-2 rounded-lg" />
      <Skeleton className="h-3 sm:h-4 w-full sm:w-96 rounded-lg" />
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 sm:h-28 rounded-xl border border-gray-200"
            delay={i}
          />
        ))}
    </div>

    {/* Search, Filters & Grid */}
    <div
      className="skeleton-fade-in rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4"
      style={{ animationDelay: "0.16s" }}
    >
      {/* Search Input */}
      <Skeleton className="h-10 sm:h-11 w-full rounded-lg" />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Skeleton className="h-10 sm:h-11 w-full sm:w-48 rounded-lg" />
        <Skeleton className="h-10 sm:h-11 w-full sm:w-40 rounded-lg" />
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-3 sm:pt-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 space-y-4 hover:shadow-lg transition-shadow"
            >
              {/* Header del card: Avatar + Nombre + Menú */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl shrink-0" />
                  {/* Nombre + Email */}
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24 sm:w-28 rounded-lg" />
                    <Skeleton className="h-3 w-32 sm:w-36 rounded-lg" />
                  </div>
                </div>
                {/* Menú de opciones */}
                <Skeleton className="h-6 w-6 rounded-lg" />
              </div>

              {/* Info del cliente: RUC + Teléfono */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-28 rounded-lg" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-4 w-24 rounded-lg" />
                </div>
              </div>

              {/* Badges: Estado + Plan + Publicaciones */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
      </div>
    </div>

    {/* Pagination */}
    <div className="skeleton-fade-in flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
      <Skeleton className="h-4 w-40 sm:w-48 rounded-lg" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-16 rounded-lg" />
        <Skeleton className="h-10 w-20 rounded-lg" />
        <div className="flex gap-1">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// PERFIL DE CLIENTE - OPTIMIZADO
// ============================================
export const ClientProfileSkeleton = () => (
  <div className="space-y-4 sm:space-y-5 lg:space-y-6">
    {/* Header */}
    <div className="skeleton-fade-in">
      <Skeleton className="h-6 sm:h-7 w-40 sm:w-48 rounded-lg mb-2" />
      <Skeleton className="h-4 w-56 sm:w-64 rounded-lg" />
    </div>

    {/* Avatar Card */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* Avatar grande circular */}
        <Skeleton className="h-24 w-24 sm:h-28 sm:w-28 rounded-full shrink-0" />

        {/* Info del usuario */}
        <div className="flex-1 space-y-2 text-center sm:text-left">
          <Skeleton className="h-5 sm:h-6 w-40 sm:w-48 rounded-lg mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-48 sm:w-56 rounded-lg mx-auto sm:mx-0" />
        </div>

        {/* Botón editar */}
        <Skeleton className="h-10 w-28 sm:w-32 rounded-lg" />
      </div>
    </div>

    {/* Form Grid - 2 columnas */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
      {/* Columna 1 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
        <Skeleton className="h-5 sm:h-6 w-36 sm:w-40 rounded-lg" />

        {/* Inputs */}
        <div className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            ))}
        </div>
      </div>

      {/* Columna 2 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 space-y-4">
        <Skeleton className="h-5 sm:h-6 w-36 sm:w-40 rounded-lg" />

        {/* Inputs */}
        <div className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24 rounded-lg" />
                <Skeleton className="h-11 w-full rounded-lg" />
              </div>
            ))}
        </div>
      </div>
    </div>

    {/* Botón guardar cambios */}
    <div className="flex justify-end">
      <Skeleton className="h-11 w-40 sm:w-48 rounded-lg" />
    </div>
  </div>
);

// ============================================
// PÁGINA DE REPORTES - OPTIMIZADO
// ============================================
export const ReportsSkeleton = () => (
  <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
    {/* Header */}
    <div className="skeleton-fade-in">
      <div className="flex items-center gap-3 sm:gap-4">
        <Skeleton className="h-9 sm:h-10 w-9 sm:w-10 rounded-lg border border-gray-200" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 sm:h-8 w-40 sm:w-48 rounded-lg" />
          <Skeleton className="h-3 sm:h-4 w-52 sm:w-64 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 sm:h-28 lg:h-32 rounded-xl border border-gray-200"
            delay={i}
          />
        ))}
    </div>

    {/* Filters */}
    <div
      className="skeleton-fade-in space-y-3 sm:space-y-4 rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6"
      style={{ animationDelay: "0.16s" }}
    >
      <Skeleton className="h-10 sm:h-11 rounded-lg" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap gap-2">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton
                key={i}
                className="h-7 sm:h-8 w-20 sm:w-24 rounded-lg"
              />
            ))}
        </div>
        <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
      </div>
    </div>

    {/* Grid de reportes */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="skeleton-fade-in rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4"
            style={{ animationDelay: `${0.06 * i}s` }}
          >
            <Skeleton className="h-4 sm:h-5 w-full rounded-lg" />
            <Skeleton className="h-3 sm:h-4 w-3/4 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-5 sm:h-6 w-16 rounded-full" />
              <Skeleton className="h-5 sm:h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-11/12 rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
            <div className="border-t border-gray-200 pt-3 sm:pt-4 flex justify-between items-center">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-8 sm:h-9 w-20 rounded-lg" />
            </div>
          </div>
        ))}
    </div>
  </div>
);

// ============================================
// PÁGINA DE ADMINISTRADORES - OPTIMIZADO
// ============================================
export const AdminsPageSkeleton = () => (
  <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
    {/* Header */}
    <div className="skeleton-fade-in">
      <Skeleton className="h-7 sm:h-8 w-48 sm:w-56 mb-2 rounded-lg" />
      <Skeleton className="h-3 sm:h-4 w-full sm:w-80 rounded-lg" />
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
      {Array(2)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 sm:h-28 rounded-xl border border-gray-200"
            delay={i}
          />
        ))}
    </div>

    {/* Search & Table */}
    <div
      className="skeleton-fade-in rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4"
      style={{ animationDelay: "0.16s" }}
    >
      {/* Title & Button */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
        <Skeleton className="h-5 sm:h-6 w-40 sm:w-48 rounded-lg" />
        <Skeleton className="h-9 sm:h-10 w-32 sm:w-40 rounded-lg" />
      </div>

      {/* Search Input */}
      <Skeleton className="h-10 sm:h-11 w-full rounded-lg" />

      {/* Table */}
      <div className="space-y-2 pt-3 sm:pt-4">
        {/* Headers - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-t-lg">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-4 w-20 rounded" />
            ))}
        </div>

        {/* Rows - Responsive layout */}
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg md:rounded-none md:border-x-0 md:border-t-0"
            >
              {Array(4)
                .fill(0)
                .map((_, j) => (
                  <Skeleton key={j} className="h-7 sm:h-8 w-full rounded-lg" />
                ))}
            </div>
          ))}
      </div>
    </div>
  </div>
);

// ============================================
// MODAL WHATSAPP - OPTIMIZADO
// ============================================
export const WhatsAppModalSkeleton = () => (
  <div className="space-y-4 sm:space-y-5">
    {/* Info Card */}
    <div className="rounded-xl p-4 sm:p-5 border-2 border-green-100 bg-green-50">
      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-48 rounded-lg" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Preview Card */}
    <div className="space-y-3">
      <Skeleton className="h-5 w-36 rounded-lg" />
      <div className="border-2 border-gray-200 rounded-xl p-4 space-y-3 bg-white">
        <Skeleton className="h-40 sm:h-48 w-full rounded-lg" />
        <Skeleton className="h-4 w-full rounded-lg" />
        <Skeleton className="h-4 w-4/5 rounded-lg" />
      </div>
      <div className="flex justify-between items-center text-sm">
        <Skeleton className="h-4 w-28 rounded-lg" />
        <Skeleton className="h-4 w-36 rounded-lg" />
      </div>
    </div>

    {/* Actions */}
    <div className="flex gap-3">
      <Skeleton className="h-11 flex-1 rounded-lg" />
      <Skeleton className="h-11 w-32 rounded-lg" />
    </div>
  </div>
);

// ============================================
// PÁGINA DE PUBLICACIONES DEL CLIENTE - OPTIMIZADO
// ============================================
export const ClientPublicationsPageSkeleton = () => (
  <div className="space-y-4 sm:space-y-5 lg:space-y-6 p-3 sm:p-4 lg:p-6">
    {/* Header */}
    <div className="skeleton-fade-in">
      <Skeleton className="h-7 sm:h-8 w-56 sm:w-64 mb-2 rounded-lg" />
      <Skeleton className="h-3 sm:h-4 w-full sm:w-96 rounded-lg" />
    </div>

    {/* Info Badge */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5">
      <Skeleton className="h-4 w-full sm:w-96 rounded-lg mb-1" />
      <Skeleton className="h-3 w-full sm:w-80 rounded-lg" />
    </div>

    {/* Search, Filters & Grid */}
    <div
      className="skeleton-fade-in rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4"
      style={{ animationDelay: "0.16s" }}
    >
      {/* Search Input */}
      <Skeleton className="h-10 sm:h-11 w-full rounded-lg" />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Skeleton className="h-10 sm:h-11 w-full sm:w-48 rounded-lg" />
        <Skeleton className="h-10 sm:h-11 w-full sm:w-40 rounded-lg" />
        <Skeleton className="h-10 sm:h-11 w-full sm:w-40 rounded-lg" />
      </div>

      {/* Results count */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-indigo-50 rounded-lg">
        <Skeleton className="h-4 w-32 rounded-lg" />
      </div>

      {/* Publications Grid (Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pt-3 sm:pt-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 space-y-3 hover:shadow-xl transition-shadow"
            >
              {/* Image/Thumbnail Placeholder */}
              <Skeleton className="h-36 w-full rounded-lg" />

              {/* Title and Subtitle */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-3/4 rounded-lg" />
                <Skeleton className="h-3 w-full rounded-lg" />
              </div>

              {/* Metadata/Status Badges and Actions */}
              <div className="flex justify-between items-center pt-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>

              {/* Date/Footer */}
              <div className="border-t border-gray-200 pt-3">
                <Skeleton className="h-3 w-24 rounded-lg" />
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
);

// ============================================
// GRID DE PUBLICACIONES ADMIN - OPTIMIZADO
// ============================================
export const AdminPostsGridSkeleton = () => (
  <div className="space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
    {/* Header */}
    <div className="skeleton-fade-in">
      <Skeleton className="h-7 sm:h-8 w-48 sm:w-56 mb-2 rounded-lg" />
      <Skeleton className="h-3 sm:h-4 w-full sm:w-96 rounded-lg" />
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="h-24 sm:h-28 rounded-xl border border-gray-200"
            delay={i}
          />
        ))}
    </div>

    {/* Search, Filters & Grid */}
    <div
      className="skeleton-fade-in rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4"
      style={{ animationDelay: "0.16s" }}
    >
      {/* Search Input */}
      <Skeleton className="h-10 sm:h-11 w-full rounded-lg" />

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <Skeleton className="h-10 sm:h-11 w-full sm:w-48 rounded-lg" />
        <Skeleton className="h-10 sm:h-11 w-full sm:w-40 rounded-lg" />
        <Skeleton className="h-10 sm:h-11 w-full sm:w-40 rounded-lg" />
      </div>

      {/* Posts Grid - Responsive 2-4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pt-3 sm:pt-4">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden space-y-3 hover:shadow-lg transition-shadow"
            >
              {/* Image placeholder */}
              <Skeleton className="h-40 w-full rounded-t-xl" />

              <div className="p-4 space-y-3">
                {/* Title */}
                <Skeleton className="h-5 w-4/5 rounded-lg" />

                {/* Metadata/Tags */}
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Footer/Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <Skeleton className="h-4 w-20 rounded-lg" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
);

export default Skeleton;
