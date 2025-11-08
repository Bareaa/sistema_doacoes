import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    console.log('AuthContext - Stored Token:', storedToken);
    console.log('AuthContext - Stored User:', storedUser);

    if (storedToken && storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('AuthContext - Parsed User:', parsedUser);
        setToken(storedToken);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, senha: string) => {
    const response = await api.post('/auth/login', { email, senha });
    console.log('Login response:', response.data);
    
    // Tenta diferentes estruturas de resposta
    const responseData = response.data.data || response.data;
    const token = responseData.token || response.data.token;
    const usuario = responseData.usuario || responseData.user || response.data.usuario || response.data.user;

    console.log('Extracted token:', token);
    console.log('Extracted usuario:', usuario);

    if (!token || !usuario) {
      throw new Error('Resposta de login inválida');
    }

    setToken(token);
    setUser(usuario);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(usuario));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const register = async (nome: string, email: string, senha: string) => {
    await api.post('/auth/register', { nome, email, senha });
    await login(email, senha);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
