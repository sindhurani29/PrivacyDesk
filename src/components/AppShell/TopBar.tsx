import { AppBar } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { useAuthStore } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

export default function TopBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header>
      <AppBar style={{ 
        borderBottom: '1px solid var(--pd-border)',
        backgroundColor: '#fff',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{
          fontWeight: 'bold',
          fontSize: '20px',
          color: 'var(--pd-text)'
        }}>
          PrivacyDesk
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ 
            fontSize: '14px', 
            color: 'var(--pd-muted)',
            marginRight: '8px'
          }}>
            Welcome, {user?.name}
          </span>
          
          <Button
            fillMode="flat"
            themeColor="base"
            style={{ color: 'var(--pd-muted)' }}
            onClick={handleRefresh}
            title="Refresh"
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
          
          <Button
            fillMode="flat"
            themeColor="base"
            style={{ color: 'var(--pd-muted)' }}
            onClick={handleLogout}
            title="Logout"
          >
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </AppBar>
    </header>
  );
}
