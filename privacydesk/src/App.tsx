import { AppBar } from '@progress/kendo-react-layout';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import RequestsPage from './pages/RequestsPage';
import Wizard from './pages/NewRequest/Wizard';

export default function App() {
  return (
    <div>
      <AppBar>
        <div style={{ padding: '0 12px', fontWeight: 700 }}>PrivacyDesk</div>
        <nav style={{ marginLeft: 'auto', display: 'flex', gap: 16 }}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/requests">Requests</Link>
          <Link to="/new">New</Link>
          <Link to="/settings">Settings</Link>
        </nav>
      </AppBar>

      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Navigate to="/requests" replace />} />
          <Route path="/dashboard" element={<div>Dashboard (placeholder)</div>} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/new" element={<Wizard />} />
          <Route path="/settings" element={<div>Settings (placeholder)</div>} />
          <Route path="*" element={<Navigate to="/requests" replace />} />
        </Routes>
      </main>
    </div>
  );
}
