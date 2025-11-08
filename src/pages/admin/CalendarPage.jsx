/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Clock,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { calendarService } from "@/services/calendar";
import CalendarNoteModal from "@/components/admin/CalendarNoteModal";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { Button } from "@/components/common/UIComponents";

const MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const DAY_NAMES = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");

  useEffect(() => {
    loadNotes();
  }, [currentDate]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const response = await calendarService.getMonthNotes(year, month);
      setNotes(response.notes || []);
      setError("");
    } catch {
      setError("Error al cargar las notas del calendario");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsNoteModalOpen(true);
  };

  const handleDeleteNote = (note) => {
    setNoteToDelete(note);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await calendarService.deleteNote(noteToDelete.id);
      setSuccess("Nota eliminada exitosamente");
      loadNotes();
      setIsConfirmModalOpen(false);
      setNoteToDelete(null);
    } catch {
      setError("Error al eliminar la nota");
    }
  };

  const handleModalSuccess = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
    loadNotes();
    setSuccess(editingNote ? "Nota actualizada" : "Nota creada");
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const currentDayRef = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDayRef));
      currentDayRef.setDate(currentDayRef.getDate() + 1);
    }

    return days;
  };

  const getNotesForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return notes.filter((note) => {
      const noteDate = new Date(note.note_date).toISOString().split("T")[0];
      return noteDate === dateStr;
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const days = getDaysInMonth();
  const filteredNotes = selectedDate ? getNotesForDate(selectedDate) : notes;

  return (
    <div className="space-y-4 sm:space-y-6 p-1 sm:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-3 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
            <span className="truncate">Calendario</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
            Gestiona tus notas y eventos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 p-1">
            <button
              onClick={() => setViewMode("calendar")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
                viewMode === "calendar"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Calendario
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              Lista
            </button>
          </div>

          <Button
            onClick={handleCreateNote}
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            className="px-3 sm:px-4 py-2"
          >
            Agregar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="flex-1 pr-2">{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-800 rounded transition-colors"
            title="Cerrar"
            aria-label="Cerrar alerta de error"
          >
            ✕
          </button>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="flex-1 pr-2">{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="text-emerald-500 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 ml-2 p-1 hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded transition-colors"
            title="Cerrar"
            aria-label="Cerrar alerta de éxito"
          >
            ✕
          </button>
        </div>
      )}

      {viewMode === "calendar" ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>

            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
              <span className="block sm:hidden">
                {MONTH_NAMES[currentDate.getMonth()].slice(0, 3)}{" "}
                {currentDate.getFullYear()}
              </span>
              <span className="hidden sm:block">
                {MONTH_NAMES[currentDate.getMonth()]}{" "}
                {currentDate.getFullYear()}
              </span>
            </h2>

            <button
              onClick={() => navigateMonth(1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>

          <div className="px-6 pb-6">
            <div className="grid grid-cols-7 mb-4 border-b border-gray-200 dark:border-gray-700">
              {DAY_NAMES.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  <span className="hidden sm:inline">{day.slice(0, 3)}</span>
                  <span className="sm:hidden">{day.slice(0, 1)}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
              {days.map((day, index) => {
                const dayNotes = getNotesForDate(day);
                const isCurrentMonth =
                  day.getMonth() === currentDate.getMonth();
                const isToday =
                  day.toDateString() === new Date().toDateString();
                const isSelected =
                  selectedDate &&
                  day.toDateString() === selectedDate.toDateString();

                return (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    onDoubleClick={() => {
                      setSelectedDate(day);
                      handleCreateNote();
                    }}
                    className={`min-h-20 sm:min-h-32 p-2 sm:p-3 cursor-pointer transition-all duration-150 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      !isCurrentMonth
                        ? "text-gray-300 dark:text-gray-600 bg-gray-50 dark:bg-gray-900"
                        : isSelected
                        ? "bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-500 dark:ring-blue-400"
                        : isToday
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    title={`${formatDate(day)} - Doble click para agregar nota`}
                  >
                    <div className="flex flex-col h-full">
                      <div
                        className={`text-sm sm:text-base font-medium mb-2 flex items-center justify-start ${
                          isToday
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : isSelected
                            ? "text-blue-600 dark:text-blue-400 font-semibold"
                            : !isCurrentMonth
                            ? "text-gray-400 dark:text-gray-600"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {day.getDate()}
                      </div>

                      <div className="flex-1 space-y-1">
                        {dayNotes.slice(0, 3).map((note) => (
                          <div
                            key={note.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditNote(note);
                            }}
                            className={`text-xs sm:text-sm px-2 py-1 rounded-md cursor-pointer transition-all hover:shadow-sm mb-1 truncate font-medium ${
                              note.is_event
                                ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 border-l-4 border-green-500"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 border-l-4 border-blue-500"
                            }`}
                            title={`${note.title} - Click para editar`}
                          >
                            <span className="block truncate">{note.title}</span>
                          </div>
                        ))}
                        {dayNotes.length > 3 && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDate(day);
                              setViewMode("list");
                            }}
                            className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 font-medium pl-2"
                            title="Click para ver todas las notas"
                          >
                            +{dayNotes.length - 3} más
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lista de Notas
            </h2>
          </div>

          <div className="p-3 sm:p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Cargando...
                </p>
              </div>
            ) : filteredNotes.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No hay notas para mostrar
                </p>
                <button
                  onClick={handleCreateNote}
                  className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                >
                  Crear primera nota
                </button>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {note.is_event ? (
                            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                          )}
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              note.is_event
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300"
                            }`}
                          >
                            {note.is_event ? "Evento" : "Nota"}
                          </span>
                        </div>

                        <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
                          {note.title}
                        </h3>

                        {note.description && (
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                            {note.description}
                          </p>
                        )}

                        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <span className="block sm:inline">
                            {formatDate(new Date(note.note_date))}
                          </span>
                          <span className="hidden sm:inline"> - </span>
                          <span className="block sm:inline">
                            {formatTime(note.note_date)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                        <button
                          onClick={() => handleEditNote(note)}
                          className="p-1.5 sm:p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-gray-400 dark:hover:text-indigo-400 dark:hover:bg-indigo-900/50 rounded-lg transition-colors"
                          title="Editar nota"
                          aria-label="Editar nota"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note)}
                          className="p-1.5 sm:p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                          title="Eliminar nota"
                          aria-label="Eliminar nota"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <CalendarNoteModal
        isOpen={isNoteModalOpen}
        onClose={() => {
          setIsNoteModalOpen(false);
          setEditingNote(null);
        }}
        onSuccess={handleModalSuccess}
        note={editingNote}
        selectedDate={selectedDate}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setNoteToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Eliminar Nota"
        message={`¿Estás seguro de que deseas eliminar la nota "${noteToDelete?.title}"?`}
        confirmButtonText="Eliminar"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default CalendarPage;
