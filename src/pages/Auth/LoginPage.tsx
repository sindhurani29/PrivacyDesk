import { useState } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import { useAuthStore } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
	const [username, setUsername] = useState('admin');
	const [password, setPassword] = useState('adm@123');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
	const { login } = useAuthStore();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		try {
			const success = await login(username, password);
			if (success) {
				navigate('/dashboard');
			} else {
				setError('Invalid username or password');
			}
		} catch (err) {
			setError('Login failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{
			minHeight: '100vh',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: '#f8fafc',
			padding: '20px'
		}}>
			<div className="pd-card" style={{
				maxWidth: '400px',
				width: '100%',
				padding: '40px'
			}}>
				<div style={{ textAlign: 'center', marginBottom: '32px' }}>
					<h1 style={{
						fontSize: '32px',
						fontWeight: '700',
						color: '#1f2937',
						marginBottom: '8px'
					}}>
						PrivacyDesk
					</h1>
					<p style={{
						fontSize: '16px',
						color: '#6b7280'
					}}>
						Sign in to your account
					</p>
				</div>

				<form onSubmit={handleSubmit}>
					<div style={{ marginBottom: '20px' }}>
						<label style={{
							display: 'block',
							fontSize: '14px',
							fontWeight: '600',
							color: '#374151',
							marginBottom: '6px'
						}}>
							Username
						</label>
						<Input
							value={username}
							onChange={(e) => setUsername(e.value as string)}
							placeholder="Enter your username"
							style={{ 
								width: '100%',
								'--kendo-input-border': '#d1d5db',
								'--kendo-input-focus-border': '#6b7280'
							} as React.CSSProperties}
							required
						/>
					</div>

					<div style={{ marginBottom: '20px' }}>
						<label style={{
							display: 'block',
							fontSize: '14px',
							fontWeight: '600',
							color: '#374151',
							marginBottom: '6px'
						}}>
							Password
						</label>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.value as string)}
							placeholder="Enter your password"
							style={{ 
								width: '100%',
								'--kendo-input-border': '#d1d5db',
								'--kendo-input-focus-border': '#6b7280'
							} as React.CSSProperties}
							required
						/>
					</div>

					{error && (
						<div style={{
							backgroundColor: '#fef2f2',
							border: '1px solid #fecaca',
							borderRadius: '6px',
							padding: '12px',
							marginBottom: '20px'
						}}>
							<p style={{
								color: '#dc2626',
								fontSize: '14px',
								margin: 0
							}}>
								{error}
							</p>
						</div>
					)}

					<Button
						type="submit"
						disabled={loading}
						style={{
							width: '100%',
							height: '44px',
							fontSize: '16px',
							fontWeight: '600',
							backgroundColor: '#6b7280',
							borderColor: '#6b7280',
							color: 'white'
						}}
					>
						{loading ? 'Signing in...' : 'Sign In'}
					</Button>
				</form>
			</div>
		</div>
	);
}
