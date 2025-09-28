import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
	username: string;
	name: string;
}

interface AuthState {
	user: User | null;
	isAuthenticated: boolean;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,

			login: async (username: string, password: string): Promise<boolean> => {
				// Simple hardcoded authentication
				if (username === 'admin' && password === 'adm@123') {
					const user: User = {
						username: 'admin',
						name: 'Administrator'
					};
					set({ user, isAuthenticated: true });
					return true;
				}
				return false;
			},

			logout: () => {
				set({ user: null, isAuthenticated: false });
			}
		}),
		{
			name: 'privacy-desk-auth'
		}
	)
);
