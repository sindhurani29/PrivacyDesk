import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer } from '@progress/kendo-react-layout';
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
  const navigate = useNavigate();
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

  const drawerItems = items.map((item) => ({
    text: item.text,
    id: item.id,
    icon: item.icon,
    selected: isActiveRoute(item.route),
    'aria-label': `Navigate to ${item.text}`,
    title: item.text
  }));

  return (
    <div ref={drawerRef} role="navigation" aria-label="Main navigation">
      <Drawer
        expanded={true}
        position="start"
        mode="push"
        mini={false}
        items={drawerItems}
        onSelect={(e) => {
          const selectedItem = items.find(item => item.id === e.itemTarget.id);
          if (selectedItem) {
            navigate(selectedItem.route);
          }
        }}
        style={{
          width: '256px',
          backgroundColor: '#fff',
          borderRight: '1px solid #e6eaf1'
        }}
      />
    </div>
  );
}
