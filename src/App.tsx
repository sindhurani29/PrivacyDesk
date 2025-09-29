import { BrowserRouter, useLocation } from 'react-router-dom';
import TopBar from './components/AppShell/TopBar';
import SideNav from './components/AppShell/SideNav';
import AppRoutes from './router';
import { Toaster } from './components/Common/Toaster';
import './index.css';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  if (isLoginPage) {
    return <AppRoutes />;
  }

  return (
    <div className="pd-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f6f8fb' }}>
      <TopBar />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <SideNav />
        <main className="pd-main" style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
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
      <Toaster />
    </BrowserRouter>
  );
}
