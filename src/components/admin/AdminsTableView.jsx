import { memo } from "react";
import { Edit, Trash, Shield, User, Mail, Calendar } from "lucide-react";
import { Button } from "../common/UIComponents";

// Formato de fecha
const formatDate = (dateString) => {
  if (!dateString) return "No disponible";
  const date = new Date(dateString);
  if (isNaN(date)) return "Fecha inválida";
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Fila de administrador
const AdminRow = memo(({ admin, onEdit, onDelete }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="shrink-0 h-10 w-10 bg-linear-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
            {admin.name
              ? admin.name.charAt(0).toUpperCase()
              : admin.email.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {admin.name || "Sin nombre"}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              {admin.email}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300">
          <Shield className="w-3 h-3 mr-1.5" />
          {admin.role}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(admin.created_at)}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end gap-2">
          <Button
            onClick={() => onEdit(admin)}
            variant="ghost"
            size="sm"
            className="p-2 text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg"
            title="Editar administrador"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(admin)}
            variant="ghost"
            size="sm"
            className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg"
            title="Eliminar administrador"
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

AdminRow.displayName = "AdminRow";

// Componente principal
const AdminsTableView = ({ admins = [], onEdit, onDelete }) => {
  if (!admins || admins.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 rounded-2xl text-center border-2 border-dashed border-gray-200 dark:border-gray-700 py-12 px-6">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          No hay administradores registrados
        </h3>
        <p className="text-sm">Comienza creando tu primer administrador</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Administrador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Fecha de Creación
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
            {admins.map((admin) => (
              <AdminRow
                key={admin.id}
                admin={admin}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsTableView;
