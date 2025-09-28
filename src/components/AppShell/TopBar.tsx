import { Button } from '@progress/kendo-react-buttons';
import { useAuthStore } from '../../store/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function TopBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/requests', label: 'Requests' },
    { href: '/new', label: 'New' },
    { href: '/settings', label: 'Settings' },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard' || location.pathname.startsWith('/dashboard');
    }
    return location.pathname.startsWith(href);
  };

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      height: '64px',
      backgroundColor: '#fff',
      borderBottom: '1px solid #e6eaf1',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      {/* App Title - Left Side */}
      <div style={{
        fontWeight: 'bold',
        fontSize: '20px',
        color: '#0f172a',
        padding: '0 16px'
      }}>
        PrivacyDesk
      </div>
      
      {/* Navigation Links - Center */}
      <nav style={{
        display: 'flex',
        gap: '24px',
        alignItems: 'center'
      }}>
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            style={{
              fontWeight: isActiveRoute(item.href) ? '700' : '600',
              fontSize: '14px',
              color: isActiveRoute(item.href) ? '#2563eb' : '#374151',
              backgroundColor: isActiveRoute(item.href) ? '#e7f0ff' : 'transparent',
              padding: '8px 16px',
              borderRadius: '8px',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              borderBottom: isActiveRoute(item.href) ? '2px solid #2563eb' : '2px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (!isActiveRoute(item.href)) {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.color = '#2563eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActiveRoute(item.href)) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#374151';
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User Actions - Far Right */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderLeft: '1px solid #e6eaf1',
        paddingLeft: '24px'
      }}>
        <span style={{
          fontSize: '14px',
          color: '#6b7280',
          fontWeight: '500'
        }}>
          Welcome, {user?.name}
        </span>
        
        <Button
          fillMode="flat"
          themeColor="base"
          onClick={handleRefresh}
          title="Refresh"
          style={{
            color: '#6b7280',
            padding: '8px'
          }}
        >
          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </Button>
        
        <Button
          fillMode="flat"
          themeColor="base"
          onClick={handleLogout}
          title="Logout"
          style={{
            color: '#6b7280',
            padding: '8px'
          }}
        >
          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </Button>
      </div>
    </header>
  );
}
