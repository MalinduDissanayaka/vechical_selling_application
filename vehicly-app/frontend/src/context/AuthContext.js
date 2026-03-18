import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function AuthProvider({ children }) {
	const [user, setUser] = useState(() => {
		const storedUser = localStorage.getItem('user');
		return storedUser ? JSON.parse(storedUser) : null;
	});

	useEffect(() => {
		if (user) {
			localStorage.setItem('user', JSON.stringify(user));
		} else {
			localStorage.removeItem('user');
		}
	}, [user]);

	const login = async (email, password) => {
		try {
			const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
			const { token, role, name } = response.data;

			localStorage.setItem('token', token);
			const nextUser = { name, role, email };
			setUser(nextUser);

			return role;
		} catch (error) {
			alert(error.response?.data?.msg || 'Login failed');
			return null;
		}
	};

	const logout = () => {
		localStorage.removeItem('token');
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}
