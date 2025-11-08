import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = () => {
      const savedUser = localStorage.getItem('psyche_compass_user');
      const authToken = localStorage.getItem('psyche_compass_auth_token');
      
      if (savedUser && authToken) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Simple demo users for authentication
  const demoUsers = [
    {
      id: 1,
      email: 'demo@psychecompass.com',
      password: 'demo123',
      name: 'Demo User',
      joinDate: '2025-01-01'
    },
    {
      id: 2,
      email: 'user@example.com',
      password: 'password',
      name: 'John Doe',
      joinDate: '2025-01-15'
    },
    {
      id: 3,
      email: 'admin@psychecompass.com',
      password: 'admin123',
      name: 'Admin User',
      joinDate: '2025-01-01'
    }
  ];

  const login = async (email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Find user in demo users
      const foundUser = demoUsers.find(
        user => user.email === email && user.password === password
      );

      if (foundUser) {
        // Remove password from user object before storing
        const { password: _, ...userWithoutPassword } = foundUser;
        
        // Generate a simple auth token
        const authToken = btoa(`${foundUser.id}-${Date.now()}`);
        
        // Save to localStorage
        localStorage.setItem('psyche_compass_user', JSON.stringify(userWithoutPassword));
        localStorage.setItem('psyche_compass_auth_token', authToken);
        
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        
        return { success: true, user: userWithoutPassword };
      } else {
        return { 
          success: false, 
          error: 'Invalid email or password. Try demo@psychecompass.com / demo123' 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: 'Login failed. Please try again.' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = demoUsers.find(user => user.email === email);
      if (existingUser) {
        return { 
          success: false, 
          error: 'User with this email already exists' 
        };
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        name,
        email,
        joinDate: new Date().toISOString().split('T')[0]
      };

      // Generate auth token
      const authToken = btoa(`${newUser.id}-${Date.now()}`);

      // Save to localStorage
      localStorage.setItem('psyche_compass_user', JSON.stringify(newUser));
      localStorage.setItem('psyche_compass_auth_token', authToken);

      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('psyche_compass_user');
    localStorage.removeItem('psyche_compass_auth_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};