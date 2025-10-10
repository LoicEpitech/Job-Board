// src/context/userContext.jsx
import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Vérifie le token et le décodage au démarrage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        const now = Date.now() / 1000;

        // Si le token est encore valide
        if (decoded.exp && decoded.exp > now) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        } else {
          // Token expiré → logout
          logout();
        }
      } catch (err) {
        console.error("Token invalide:", err);
        logout();
      }
    }
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
