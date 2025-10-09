import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user/admin in localStorage
    const savedUser = localStorage.getItem('user');
    const savedAdmin = localStorage.getItem('admin');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    
    setLoading(false);
  }, []);

  const loginAsUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const loginAsAdmin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('admin', JSON.stringify(adminData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const logoutAdmin = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loading,
        loginAsUser,
        loginAsAdmin,
        logoutUser,
        logoutAdmin,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
