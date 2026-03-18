import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [token, setToken] = useState(() => localStorage.getItem('token') || '');

	useEffect(() => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
	}, [user]);

	useEffect(() => {
		if (token) {
			localStorage.setItem('token', token);
		} else {
			localStorage.removeItem('token');
		}
	}, [token]);

	const setSession = ({ token: nextToken, role, name, email }) => {
		setToken(nextToken || '');
		setUser({ name, role, email });
	};

	const login = async (email, password) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
			const { token: nextToken, role, name, email: resolvedEmail } = response.data;
			setSession({ token: nextToken, role, name, email: resolvedEmail || email });

			return { role };
		} catch (error) {
			const message = error.response?.data?.msg || 'Login failed';
			return { role: null, error: message };
		}
	};

	const register = async (name, email, password) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
				name,
				email,
				password
			});

			const { token: nextToken, role, email: resolvedEmail } = response.data;
			setSession({ token: nextToken, role, name, email: resolvedEmail || email });

			return { role };
		} catch (error) {
			const message = error.response?.data?.msg || 'Registration failed';
			return { role: null, error: message };
		}
	};

	const logout = () => {
		setToken('');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, token, setUser, login, register, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
