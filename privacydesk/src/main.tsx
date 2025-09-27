import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import TopBar from './components/AppShell/TopBar';
import SideNav from './components/AppShell/SideNav';
import AppRoutes from './router';
import '@progress/kendo-theme-default/dist/all.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <TopBar />
      <div className="pd-shell">
        <SideNav />
        <main id="main" className="pd-main">
          <AppRoutes />
        </main>
      </div>
    </BrowserRouter>
  </React.StrictMode>
);