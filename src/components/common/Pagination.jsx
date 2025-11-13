import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalPages,
  pageSize,
  setPage,
  setPageSize,
  totalItems,
  label = "elementos",
  className = "",
}) {
  return (
    <section
      className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-700">
          Mostrando{" "}
          <span className="font-bold text-gray-900">
            {totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{" "}
          a{" "}
          <span className="font-bold text-gray-900">
            {Math.min(currentPage * pageSize, totalItems)}
          </span>{" "}
          de <span className="font-bold text-gray-900">{totalItems}</span>{" "}
          {label}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-gray-600">Items:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value) || 4)}
              className="rounded border border-gray-300 bg-transparent px-2 py-1"
            >
              {[4, 8].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 border rounded disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2">
              {totalPages === 0 ? 0 : currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 border rounded disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
