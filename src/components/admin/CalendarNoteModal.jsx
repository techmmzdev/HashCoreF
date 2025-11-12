// frontend/src/components/admin/CalendarNoteModal.jsx
import { useState, useEffect } from "react";
import { X, Calendar, Clock, FileText, Save } from "lucide-react";
import { calendarService } from "@/services/calendar";
import { useFormModal } from "../../hooks/useModal";
import { Input, Textarea, Checkbox } from "../common/FormElements";
import { Button } from "../common/UIComponents";

const CalendarNoteModal = ({
  isOpen,
  onClose,
  onSuccess,
  note,
  selectedDate,
}) => {
  // Hook para modal con scroll blocking y ESC handling
  const { modalRef, handleBackdropClick, handleContentClick } = useFormModal({
    isOpen,
    onClose,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    note_date: "",
    is_event: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Función para formatear fecha para input datetime-local (zona horaria local)
  const formatDateForInput = (date) => {
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );
    return localDate.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (isOpen) {
      if (note) {
        // Editing existing note
        const noteDate = new Date(note.note_date);
        const dateString = formatDateForInput(noteDate);

        setFormData({
          title: note.title || "",
          description: note.description || "",
          note_date: dateString,
          is_event: note.is_event || false,
        });
      } else {
        // Creating new note
        const now = new Date();
        let defaultDate;

        if (selectedDate) {
          // Use selected date but with current time
          defaultDate = new Date(selectedDate);
          defaultDate.setHours(now.getHours(), now.getMinutes());
        } else {
          // Use current date and time
          defaultDate = now;
        }

        const dateString = formatDateForInput(defaultDate);

        setFormData({
          title: "",
          description: "",
          note_date: dateString,
          is_event: false,
        });
      }
      setErrors({});
    }
  }, [isOpen, note, selectedDate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "El título es requerido";
    }

    if (!formData.note_date) {
      newErrors.note_date = "La fecha es requerida";
    } else {
      const selectedDateTime = new Date(formData.note_date);
      const now = new Date();

      // Comparar solo hasta minutos, ignorando segundos y milisegundos
      const nowMinutes = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        now.getHours(),
        now.getMinutes()
      );
      const selectedMinutes = new Date(
        selectedDateTime.getFullYear(),
        selectedDateTime.getMonth(),
        selectedDateTime.getDate(),
        selectedDateTime.getHours(),
        selectedDateTime.getMinutes()
      );

      if (selectedMinutes < nowMinutes) {
        newErrors.note_date = "La fecha no puede ser en el pasado";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const noteData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        note_date: new Date(formData.note_date).toISOString(),
        is_event: formData.is_event,
      };

      if (note) {
        // Update existing note
        await calendarService.updateNote(note.id, noteData);
      } else {
        // Create new note
        await calendarService.createNote(noteData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving note:", error);
      setErrors({
        submit: error.message || "Error al guardar la nota",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        onClick={handleContentClick}
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-gray-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <span className="truncate">
              {note ? "Editar Nota" : "Agregar Nota"}
            </span>
          </h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="shrink-0 p-1.5 sm:p-2 rounded-lg"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-5"
        >
          {/* Title */}
          <div>
            <Input
              label="Título"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Ingresa el título de la nota"
              maxLength={255}
              required
            />
          </div>

          {/* Type Toggle */}
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
            <Checkbox
              name="is_event"
              checked={formData.is_event}
              onChange={handleChange}
              label={
                <div className="flex items-center gap-2">
                  {formData.is_event ? (
                    <>
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Marcar como evento
                      </span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Nota simple
                      </span>
                    </>
                  )}
                </div>
              }
            />
            <p className="text-xs text-gray-600 mt-2 ml-7 leading-relaxed">
              Los eventos aparecen destacados en el calendario
            </p>
          </div>

          {/* Date and Time */}
          <div>
            <Input
              label="Fecha y Hora"
              type="datetime-local"
              name="note_date"
              value={formData.note_date}
              onChange={handleChange}
              error={errors.note_date}
              required
            />
          </div>

          {/* Description */}
          <div>
            <Textarea
              label="Descripción"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Descripción adicional (opcional)"
              maxLength={1000}
              showCharCount
            />
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="w-full sm:w-auto"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              variant="primary"
              className="w-full sm:w-auto"
              icon={
                loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
            >
              {loading
                ? "Guardando..."
                : `${note ? "Actualizar" : "Crear"} Nota`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CalendarNoteModal;
