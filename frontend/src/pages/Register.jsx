import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import styles from "./modules/Register.module.css";

function Register() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [type, setType] = useState("candidat");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prenom, nom, email, password, type }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      setUser(data.user);
      navigate("/");
    } else {
      setMessage(data.message || "Erreur d'inscription.");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2>Inscription</h2>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmez le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="type"
              value="candidat"
              checked={type === "candidat"}
              onChange={() => setType("candidat")}
            />
            Candidat
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="type"
              value="recruteur"
              checked={type === "recruteur"}
              onChange={() => setType("recruteur")}
            />
            Recruteur
          </label>
        </div>

        <button className={styles.btnRegister} type="submit">
          S'inscrire
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
}

export default Register;
