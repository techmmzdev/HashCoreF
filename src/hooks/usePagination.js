import { useState, useMemo } from "react";

export function usePagination(items = [], initialPageSize = 4) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / pageSize));
  }, [items.length, pageSize]);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  // Cambia de página, asegurando límites
  const setPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  // Cambia tamaño de página y reinicia a la primera página
  const setPageSizeSafe = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    paginatedItems,
    setPage,
    setPageSize: setPageSizeSafe,
  };
}
