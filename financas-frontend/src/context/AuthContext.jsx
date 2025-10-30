import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Carregar usuário e token ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      
      // Armazenar token e usuário
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.usuario));
      
      setToken(response.token);
      setUser(response.usuario);
      
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  // Register
  const register = async (nome, email, password, confirmPassword) => {
    try {
      const response = await authService.register(nome, email, password, confirmPassword);
      
      // Armazenar token e usuário
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.usuario));
      
      setToken(response.token);
      setUser(response.usuario);
      
      return response;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  };

  // Logout - Remove token e invalida sessão
  const logout = () => {
    // Remover do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Limpar estado
    setToken(null);
    setUser(null);
    
    console.log('✅ Token removido. Logout realizado com sucesso!');
  };

  // Verificar se está autenticado
  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated,
        loading
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};