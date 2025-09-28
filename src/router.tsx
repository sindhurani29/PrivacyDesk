import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/DashboardPage.tsx';
import RequestsPage from './pages/Requests/RequestsPage.tsx';
import Wizard from './pages/NewRequest/Wizard.tsx';
import CasePage from './pages/Case/CasePage.tsx';
import SettingsPage from './pages/Settings/SettingsPage.tsx';
import LoginPage from './pages/Auth/LoginPage.tsx';
import ProtectedRoute from './components/Auth/ProtectedRoute.tsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/requests" element={<ProtectedRoute><RequestsPage /></ProtectedRoute>} />
      <Route path="/new" element={<ProtectedRoute><Wizard /></ProtectedRoute>} />
      <Route path="/case/:id" element={<ProtectedRoute><CasePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
