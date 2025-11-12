import { useEffect, useMemo, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { publicationService } from "@/services/publication";
import { clientService } from "@/services/client";
import {
  Loader2,
  FileText,
  ChevronLeft,
  Search,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import ReportModal from "@/components/admin/ReportModal";
import { ReportsSkeleton } from "../../components/common/Skeleton";

const STATUS_CONFIG = {
  PUBLISHED: {
    label: "Editada",
    color: "green",
    icon: "✅",
    bgClass:
      "bg-green-50/50 border-l-4 border-l-green-500",
    badgeClass:
      "bg-green-100 text-green-800",
  },
  DRAFT: {
    label: "En Proceso",
    color: "yellow",
    icon: "📝",
    bgClass:
      "bg-yellow-50/50 border-l-4 border-l-yellow-500",
    badgeClass:
      "bg-yellow-100 text-yellow-800",
  },
  SCHEDULED: {
    label: "Programada",
    color: "indigo",
    icon: "📅",
    bgClass:
      "bg-indigo-50/50 border-l-4 border-l-indigo-500",
    badgeClass:
      "bg-indigo-100 text-indigo-800",
  },
};

const STATUS_FILTERS = [
  { key: "ALL", label: "Todas" },
  { key: "PUBLISHED", label: "Editadas" },
  { key: "SCHEDULED", label: "Programadas" },
  { key: "DRAFT", label: "En Proceso" },
];

const StatCard = memo(({ icon: Icon, label, value, colorClass, statusKey }) => (
  <div
    className={`rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 bg-white ${
      statusKey && STATUS_CONFIG[statusKey]?.bgClass
    }`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-4xl font-bold text-gray-900 mt-2">
          {value}
        </p>
      </div>
      {Icon ? (
        <Icon className={`h-8 w-8 ${colorClass}`} />
      ) : (
        <span className="text-3xl">{STATUS_CONFIG[statusKey]?.icon}</span>
      )}
    </div>
  </div>
));

StatCard.displayName = "StatCard";

const PublicationCard = memo(({ publication, onOpenReport }) => {
  const statusUpper = useMemo(
    () => (publication.status || "").toUpperCase(),
    [publication.status]
  );
  const statusConfig = STATUS_CONFIG[statusUpper];

  return (
    <article
      className={`rounded-xl p-5 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 print:page-break-inside-avoid print:break-inside-avoid bg-white border border-gray-200 ${statusConfig?.bgClass}`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:flex-col print:gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 print:text-base">
            {publication.title || "Sin título"}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mb-3 print:mb-1">
            {publication.content_type && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                {publication.content_type}
              </span>
            )}
            {statusConfig && (
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${statusConfig.badgeClass}`}
              >
                {statusConfig.label}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 print:text-xs">
            Cliente ID:{" "}
            <span className="font-medium">
              {publication.client_id || "N/A"}
            </span>
          </p>
        </div>

        <button
          onClick={() => onOpenReport(publication)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 print:hidden whitespace-nowrap active:scale-95"
        >
          <FileText className="h-4 w-4" />
          Generar Reporte
        </button>
      </div>
    </article>
  );
});

PublicationCard.displayName = "PublicationCard";

const ReportsPage = () => {
  const navigate = useNavigate();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadPublications = async () => {
      setLoading(true);
      try {
        const data = await publicationService.getAllPublications();
        setPublications(data || []);
      } catch (err) {
        console.error("Error al cargar publicaciones:", err);
        toast.error("No se pudieron cargar las publicaciones.");
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, []);

  const filteredPublications = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    return publications.filter((pub) => {
      const matchesStatus =
        statusFilter === "ALL" ||
        (pub.status || "").toUpperCase() === statusFilter;

      const matchesSearch =
        !lowerSearch ||
        (pub.title || "").toLowerCase().includes(lowerSearch) ||
        (pub.content || "").toLowerCase().includes(lowerSearch) ||
        (pub.client_id || "").toString().includes(lowerSearch);

      return matchesStatus && matchesSearch;
    });
  }, [publications, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const statusCounts = publications.reduce((acc, p) => {
      const status = (p.status || "").toUpperCase();
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      total: publications.length,
      published: statusCounts.PUBLISHED || 0,
      draft: statusCounts.DRAFT || 0,
      scheduled: statusCounts.SCHEDULED || 0,
    };
  }, [publications]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((status) => {
    setStatusFilter(status);
  }, []);

  const handleOpenReport = useCallback(async (publication) => {
    setSelectedPublication(publication);
    setSelectedClient(null);
    setModalOpen(true);

    try {
      if (publication?.client_id) {
        const clientData = await clientService.getClientById(
          publication.client_id
        );
        setSelectedClient(clientData || null);
      }
    } catch (err) {
      console.error("Error al cargar cliente:", err);
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setSelectedPublication(null);
    setSelectedClient(null);
  }, []);

  // Loading state
  if (loading) {
    return <ReportsSkeleton />;
  }

  return (
    <div className="space-y-6 print:space-y-0 animate-fadeIn">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors active:scale-95"
            aria-label="Volver atrás"
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Reportes de Publicaciones
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Genera reportes detallados de las publicaciones
            </p>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 print:hidden">
        <StatCard
          icon={FileText}
          label="Total"
          value={stats.total}
          colorClass="text-indigo-500"
        />
        <StatCard
          label="Editadas"
          value={stats.published}
          statusKey="PUBLISHED"
        />
        <StatCard label="En Proceso" value={stats.draft} statusKey="DRAFT" />
        <StatCard
          label="Programadas"
          value={stats.scheduled}
          statusKey="SCHEDULED"
        />
      </section>

      {/* Filtros */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 print:hidden">
        <div className="space-y-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Buscar por título, contenido o cliente..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => handleStatusFilterChange(filter.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    statusFilter === filter.key
                      ? "bg-indigo-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="px-4 py-2 bg-indigo-50 rounded-lg text-sm font-semibold text-indigo-600">
              {filteredPublications.length} resultado
              {filteredPublications.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      </section>

      {/* Lista de Publicaciones */}
      <section>
        {filteredPublications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-600">
              {searchTerm
                ? "No se encontraron publicaciones"
                : "No hay publicaciones disponibles"}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {searchTerm
                ? "Intenta con otro término de búsqueda"
                : "Las publicaciones aparecerán aquí"}
            </p>
          </div>
        ) : (
          <div className="space-y-4 print:space-y-2">
            {filteredPublications.map((pub) => (
              <PublicationCard
                key={pub.id}
                publication={pub}
                onOpenReport={handleOpenReport}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal de Reporte */}
      <ReportModal
        open={modalOpen}
        onClose={handleCloseModal}
        publication={selectedPublication}
        client={selectedClient}
      />
    </div>
  );
};

export default ReportsPage;
