import { useLocation, Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

interface NavItem {
  text: string;
  route: string;
  icon: string;
  id: string;
}

const items: NavItem[] = [
  { 
    id: 'dashboard',
    text: 'Dashboard', 
    route: '/dashboard', 
    icon: '🏠'
  },
  { 
    id: 'requests',
    text: 'Requests', 
    route: '/requests', 
    icon: '📋'
  },
  { 
    id: 'new-request',
    text: 'New Request', 
    route: '/new', 
    icon: '➕'
  },
  { 
    id: 'settings',
    text: 'Settings', 
    route: '/settings', 
    icon: '⚙️'
  },
];

export default function SideNav() {
  const { pathname } = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);

  const isActiveRoute = (route: string): boolean => {
    if (route === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(route);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Allow natural focus flow, don't trap focus for persistent drawer
        (document.activeElement as HTMLElement)?.blur?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Alternative approach: Custom navigation list instead of Kendo Drawer
  return (
    <div 
      ref={drawerRef} 
      role="navigation" 
      aria-label="Main navigation"
      style={{
        width: '256px',
        backgroundColor: '#fff',
        borderRight: '1px solid #e6eaf1',
        padding: '16px 0'
      }}
    >
      <nav>
        {items.map((item) => (
          <Link
            key={item.id}
            to={item.route}
            className={`nav-item ${isActiveRoute(item.route) ? 'active' : ''}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              margin: '4px 8px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: isActiveRoute(item.route) ? '#2563eb' : '#374151',
              backgroundColor: isActiveRoute(item.route) ? '#e7f0ff' : 'transparent',
              fontWeight: isActiveRoute(item.route) ? 600 : 400,
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              if (!isActiveRoute(item.route)) {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }
            }}
            onMouseOut={(e) => {
              if (!isActiveRoute(item.route)) {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            <span style={{ marginRight: '12px', fontSize: '16px' }}>
              {item.icon}
            </span>
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
