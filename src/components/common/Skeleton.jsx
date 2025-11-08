import React from "react";

// ============================================
// ESTILOS GLOBALES - SIMPLE Y LIMPIO
// ============================================
const skeletonStyles = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .skeleton-base {
    background: linear-gradient(
      90deg,
      rgb(229, 231, 235) 0%,
      rgb(243, 244, 246) 50%,
      rgb(229, 231, 235) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }

  .dark .skeleton-base {
    background: linear-gradient(
      90deg,
      rgb(55, 65, 81) 0%,
      rgb(75, 85, 99) 50%,
      rgb(55, 65, 81) 100%
    );
  }

  .skeleton-fade-in {
    animation: fadeInUp 0.5s ease-out forwards;
  }
`;

// ============================================
// COMPONENTE BASE
// ============================================
const Skeleton = ({ className = "", animate = true, delay = 0 }) => {
  const delayStyle = delay > 0 ? { animationDelay: `${delay * 0.08}s` } : {};

  return (
    <div
      className={`skeleton-base ${
        animate ? "" : "bg-gray-200 dark:bg-gray-700"
      } ${className}`}
      style={delayStyle}
      aria-hidden="true"
    />
  );
};

// ============================================
// DASHBOARD ADMIN
// ============================================
export const AdminDashboardSkeleton = () => (
  <div className="space-y-6 p-4 lg:p-6">
    <style>{skeletonStyles}</style>

    {/* Header */}
    <div className="skeleton-fade-in">
      <Skeleton className="h-8 w-64 mb-2 rounded-lg" />
      <Skeleton className="h-4 w-96 rounded-lg" />
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="h-32 rounded-xl border border-gray-200 dark:border-gray-700"
            delay={i}
          />
        ))}
    </div>

    {/* Chart */}
    <Skeleton
      className="h-80 rounded-xl border border-gray-200 dark:border-gray-700"
      delay={1}
    />

    {/* Recent Activity */}
    <div
      className="skeleton-fade-in space-y-3"
      style={{ animationDelay: "0.16s" }}
    >
      <Skeleton className="h-6 w-32 rounded-lg" />
      <div className="space-y-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="h-12 rounded-lg border border-gray-200 dark:border-gray-700"
            />
          ))}
      </div>
    </div>
  </div>
);

// ============================================
// DASHBOARD CLIENTE
// ============================================
export const ClientDashboardSkeleton = () => (
  <div className="space-y-4 sm:space-y-6 p-4 lg:p-6">
    <style>{skeletonStyles}</style>

    {/* Welcome Section */}
    <Skeleton className="h-32 rounded-xl border border-gray-200 dark:border-gray-700" />

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="h-28 rounded-xl border border-gray-200 dark:border-gray-700"
            delay={i}
          />
        ))}
    </div>

    {/* Recent Activity */}
    <div
      className="skeleton-fade-in space-y-3"
      style={{ animationDelay: "0.16s" }}
    >
      <Skeleton className="h-6 w-36 rounded-lg" />
      <div className="space-y-2">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="h-12 rounded-lg border border-gray-200 dark:border-gray-700"
            />
          ))}
      </div>
    </div>
  </div>
);

// ============================================
// TABLA DE CLIENTES
// ============================================
export const ClientsTableSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <style>{skeletonStyles}</style>

    {/* Header */}
    <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-700">
      <Skeleton className="h-6 w-32 rounded-lg" />
    </div>

    {/* Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <th key={i} className="px-4 sm:px-6 py-3">
                  <Skeleton className="h-4 w-16 rounded" />
                </th>
              ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <tr key={i}>
                {Array(5)
                  .fill(0)
                  .map((_, j) => (
                    <td key={j} className="px-4 sm:px-6 py-4">
                      <Skeleton className="h-4 w-24 rounded" />
                    </td>
                  ))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ============================================
// PERFIL DE CLIENTE
// ============================================
export const ClientProfileSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 lg:p-6">
    <style>{skeletonStyles}</style>

    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Skeleton className="h-28 rounded-xl border border-gray-200 dark:border-gray-700" />

      {/* Form Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-6 w-40 rounded-lg" />
              <div className="space-y-3">
                {Array(4)
                  .fill(0)
                  .map((_, j) => (
                    <Skeleton
                      key={j}
                      className="h-10 rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                  ))}
              </div>
              <Skeleton className="h-10 w-24 rounded-lg border border-gray-200 dark:border-gray-700" />
            </div>
          ))}
      </div>
    </div>
  </div>
);

// ============================================
// PÁGINA DE REPORTES
// ============================================
export const ReportsSkeleton = () => (
  <div className="space-y-6 p-4 lg:p-6">
    <style>{skeletonStyles}</style>

    {/* Header */}
    <div className="skeleton-fade-in">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-lg border border-gray-200 dark:border-gray-700" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="h-32 rounded-xl border border-gray-200 dark:border-gray-700"
            delay={i}
          />
        ))}
    </div>

    {/* Filters */}
    <div
      className="skeleton-fade-in space-y-4 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6"
      style={{ animationDelay: "0.16s" }}
    >
      <Skeleton className="h-11 rounded-lg" />
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-lg" />
            ))}
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>

    {/* Grid de reportes */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className="skeleton-fade-in rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 space-y-4"
            style={{ animationDelay: `${0.06 * i}s` }}
          >
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-11/12 rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center">
              <Skeleton className="h-4 w-16 rounded" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </div>
        ))}
    </div>
  </div>
);

// ============================================
// PÁGINA DE ADMINISTRADORES
// ============================================
export const AdminsPageSkeleton = () => (
  <div className="space-y-6 p-4 lg:p-6">
    <style>{skeletonStyles}</style>

    {/* Header */}
    <div className="skeleton-fade-in">
      <Skeleton className="h-8 w-56 mb-2 rounded-lg" />
      <Skeleton className="h-4 w-80 rounded-lg" />
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {Array(2)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className="h-28 rounded-xl border border-gray-200 dark:border-gray-700"
            delay={i}
          />
        ))}
    </div>

    {/* Search & Table */}
    <div
      className="skeleton-fade-in rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 space-y-4"
      style={{ animationDelay: "0.16s" }}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>

      <Skeleton className="h-11 w-full rounded-lg" />

      {/* Table */}
      <div className="space-y-2 pt-4">
        {/* Headers - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-4 w-20 rounded" />
            ))}
        </div>

        {/* Rows */}
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4 p-3 border border-gray-200 dark:border-gray-700 rounded-lg md:rounded-none md:border-x-0 md:border-t-0"
            >
              {Array(4)
                .fill(0)
                .map((_, j) => (
                  <Skeleton key={j} className="h-8 w-24 rounded-lg" />
                ))}
            </div>
          ))}
      </div>
    </div>
  </div>
);

// ============================================
// MODAL WHATSAPP
// ============================================
export const WhatsAppModalSkeleton = () => (
  <div className="space-y-4">
    <style>{skeletonStyles}</style>

    <div className="rounded-lg p-4 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
      <Skeleton className="h-5 w-40 mb-2 rounded-lg" />
      <div className="space-y-2">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-lg" />
          ))}
      </div>
    </div>

    <div>
      <Skeleton className="h-5 w-32 mb-3 rounded-lg" />
      <Skeleton className="h-32 sm:h-36 w-full mb-2 rounded-lg" />
      <div className="flex justify-between gap-2">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-4 w-32 rounded-lg" />
      </div>
    </div>
  </div>
);

// ============================================
// TARJETA DE PUBLICACIÓN
// ============================================
export const PublicationCardSkeleton = () => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
    <style>{skeletonStyles}</style>

    {/* Image */}
    <Skeleton className="h-48 w-full rounded-none" />

    {/* Content */}
    <div className="p-4 sm:p-5 space-y-3">
      <Skeleton className="h-5 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4 rounded-lg" />

      <div className="flex gap-2 py-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="space-y-2">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className="h-3 rounded"
              style={{ width: ["100%", "92%", "75%"][i] }}
            />
          ))}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-lg" />
          ))}
      </div>
    </div>
  </div>
);

// ============================================
// GRID DE PUBLICACIONES
// ============================================
export const PublicationsGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
    <style>{skeletonStyles}</style>

    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="skeleton-fade-in"
        style={{ animationDelay: `${0.05 * i}s` }}
      >
        <PublicationCardSkeleton />
      </div>
    ))}
  </div>
);

export default Skeleton;
