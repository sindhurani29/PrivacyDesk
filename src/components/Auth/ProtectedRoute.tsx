import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { useEffect } from 'react';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, login } = useAuthStore();

	// Auto-login for demo purposes
	useEffect(() => {
		if (!isAuthenticated) {
			// Automatically log in with demo credentials
			login('admin', 'adm@123');
		}
	}, [isAuthenticated, login]);

	if (!isAuthenticated) {
		return <Navigate to="/login" replace />;
	}

	return <>{children}</>;
}
