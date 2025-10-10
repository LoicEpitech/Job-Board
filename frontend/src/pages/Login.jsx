import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import styles from "./modules/Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const { token, user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/");
    } else {
      setMessage(data.message || "Erreur de connexion.");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <h2>Connexion</h2>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => setEmail(e.target.value.toLowerCase())}
          required
        />

        <label>Mot de passe</label>
        <input
          type="password"
          placeholder="Votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className={styles.btnLogin}>
          Se connecter
        </button>
        {message && <div className={styles.message}>{message}</div>}
      </form>
      <p>
        Pas encore de compte ? <a href="/register">Inscrivez-vous</a>
      </p>
    </div>
  );
}

export default Login;
