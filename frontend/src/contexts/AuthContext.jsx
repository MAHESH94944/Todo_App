import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await auth.me();
        if (mounted) setUser(me?.user || null);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const register = async (payload) => {
    const res = await auth.register(payload);
    // backend sets cookie; optionally return user
    if (res?.user) setUser(res.user);
    return res;
  };

  const login = async (payload) => {
    const res = await auth.login(payload);
    if (res?.user) setUser(res.user);
    return res;
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
