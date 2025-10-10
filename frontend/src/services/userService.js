// services/userService.js
import axios from "axios";

const API_URL = "/api/auth";

// Connexion
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data; // contient user et token
};

// Inscription
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Déconnexion (facultatif)
export const logoutUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Récupère l'utilisateur courant
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
