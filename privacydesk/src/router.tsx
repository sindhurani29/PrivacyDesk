import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardPage from './pages/Dashboard/DashboardPage.tsx';
import RequestsPage from './pages/Requests/RequestsPage.tsx';
import Wizard from './pages/NewRequest/Wizard.tsx';
import CasePage from './pages/Case/CasePage.tsx';
import SettingsPage from './pages/Settings/SettingsPage.tsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/requests" element={<RequestsPage />} />
      <Route path="/new" element={<Wizard />} />
      <Route path="/case/:id" element={<CasePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
