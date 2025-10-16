import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { useApi } from "../services/api";
import styles from "./modules/Login.module.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const apiFetch = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res) {
      return;
    }

    const data = await res.json();

    if (res.ok) {
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
      <p>
        <a
          href="#"
          onClick={() => setShowForgot(true)}
          className={styles.forgotLink}
        >
          Mot de passe oublié ?
        </a>
      </p>

      {showForgot && (
        <form
          className={styles.forgotForm}
          onSubmit={async (e) => {
            e.preventDefault();
            const res = await apiFetch("/api/auth/forgot-password", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: forgotEmail }),
            });
            if (!res) return;
            const data = await res.json();
            setForgotMsg(
              res.ok
                ? "Un email de réinitialisation a été envoyé."
                : data.message || "Erreur lors de l'envoi."
            );
          }}
        >
          <label>Votre email</label>
          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.btnLogin}>
            Envoyer le mail de réinitialisation
          </button>
          {forgotMsg && <div className={styles.message}>{forgotMsg}</div>}
          <button
            type="button"
            className={styles.btnLogin}
            onClick={() => setShowForgot(false)}
          >
            Annuler
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;
