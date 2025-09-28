import { BrowserRouter, useLocation } from 'react-router-dom';
import TopBar from './components/AppShell/TopBar';
import SideNav from './components/AppShell/SideNav';
import AppRoutes from './router';
import '@progress/kendo-theme-default/dist/all.css';
import './index.css';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <AppRoutes />;
  }

  return (
    <div className="pd-shell">
      <TopBar />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <SideNav />
        <main className="pd-main">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
