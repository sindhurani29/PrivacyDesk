import { useNavigate, useLocation } from 'react-router-dom';

const items = [
  { 
    text: 'Dashboard', 
    route: '/dashboard', 
    icon: '🏠'
  },
  { 
    text: 'Requests', 
    route: '/requests', 
    icon: '📋'
  },
  { 
    text: 'New Request', 
    route: '/new', 
    icon: '➕'
  },
  { 
    text: 'Settings', 
    route: '/settings', 
    icon: '⚙️'
  },
];

export default function SideNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isActiveRoute = (route: string) => {
    if (route === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(route);
  };

  return (
    <nav style={{
      width: '256px',
      backgroundColor: '#fff',
      borderRight: '1px solid #e6eaf1',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100%'
    }}>
      <div style={{ padding: '16px', flex: 1 }}>
        {items.map((item) => {
          const isActive = isActiveRoute(item.route);
          return (
            <button
              key={item.route}
              onClick={() => navigate(item.route)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                textAlign: 'left',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '4px',
                backgroundColor: isActive ? '#e7f0ff' : 'transparent',
                color: isActive ? '#2563eb' : '#6b7280',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                borderLeft: isActive ? '4px solid #2563eb' : '4px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                  e.currentTarget.style.color = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#6b7280';
                }
              }}
            >
              <span style={{ 
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '20px'
              }}>
                {item.icon}
              </span>
              <span style={{ fontWeight: 'inherit' }}>{item.text}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
