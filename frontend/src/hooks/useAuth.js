import { useCallback, useState, useEffect } from "react";

function readUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState(readUser);

  useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener("storage", sync);
    window.addEventListener("jps-auth-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("jps-auth-change", sync);
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("jps-auth-change"));
  }, []);

  const setUserAndToken = useCallback((userData, token) => {
    if (token) localStorage.setItem("token", token);
    if (userData) localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("jps-auth-change"));
  }, []);

  return {
    user,
    logout,
    setUser: setUserAndToken,
    isLoggedIn: Boolean(user),
  };
}

export function getStoredToken() {
  return localStorage.getItem("token");
}
