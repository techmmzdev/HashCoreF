import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFoundPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";

// Admin
import AdminLayout from "@/components/layout/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminClientsPage from "@/pages/admin/AdminClientsPage";
import AdminsPage from "@/pages/admin/AdminsPage";
import AdminPublicationsPage from "@/pages/admin/AdminPublicationsPage";
import ReportsPage from "@/pages/admin/ReportsPage";
import CalendarPage from "@/pages/admin/CalendarPage";

// Client
import ClientLayout from "@/components/layout/ClientLayout";
import ClientDashboard from "@/pages/client/ClientDashboard";
import ClientPublicationsPage from "@/pages/client/ClientPublicationsPage";
import ClientProfilePage from "@/pages/client/ClientProfilePage";

// Components
import ProtectedRoute from "@/components/common/ProtectedRoute";

function AppRoutes() {
  const { isAuthenticated, isAdmin, isClient } = useAuth();

  return (
    <Routes>
      {/* Ruta raíz - Redirige según autenticación */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            isAdmin ? (
              <Navigate to="/admin" replace />
            ) : isClient ? (
              <Navigate to="/client" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          ) : (
            <HomePage/>
          )
        }
      />

      {/* Login - Accesible solo si NO está autenticado */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes - Solo ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard principal del admin */}
        <Route index element={<AdminDashboard />} />
        <Route path="clients" element={<AdminClientsPage />} />
        <Route
          path="clients/:clientId/publications"
          element={<AdminPublicationsPage />}
        />
        <Route path="users" element={<AdminsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="calendar" element={<CalendarPage />} />

        {/* Aquí irán más rutas de admin */}
        {/* <Route path="publications" element={<PublicationsPage />} /> */}
      </Route>

      {/* Client Routes - Solo CLIENTE */}
      <Route
        path="/client"
        element={
          <ProtectedRoute clientOnly>
            <ClientLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard principal del cliente */}
        <Route index element={<ClientDashboard />} />
        <Route path="publications" element={<ClientPublicationsPage />} />
        <Route path="profile" element={<ClientProfilePage />} />

        {/* Aquí irán más rutas de cliente */}
        {/* <Route path="calendar" element={<MyCalendarPage />} /> */}
      </Route>

      {/* Error Pages */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
