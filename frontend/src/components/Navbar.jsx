import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import styles from "./modules/Navbar.module.css";

function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  return (
    <header className={styles.navbar}>
      <div
        className={styles.navbarLogo}
        style={{ cursor: "pointer" }}
        onClick={() => navigate("/")}
      >
        <img
          src="/assets/jobKing.png"
          alt="Logo JobBoard"
          className={styles.logoImg}
        />
        <h1>
          Job<span className={styles.highlight}>King</span>
        </h1>
      </div>

      <nav className={styles.navbarLinks}>
        {user?.type === "candidat" && (
          <>
            <Link to="/jobs">Offres</Link>
            <Link to="/my-applications">Mes Candidatures</Link>
          </>
        )}
        {user?.type === "recruteur" && (
          <>
            <Link to="/post-job">Créer une offre</Link>
            <Link to="/my-jobs">Mes offres créées</Link>
            {/* puis apres les application recu par offres */}
          </>
        )}
        {user?.type === "admin" && (
          <>
            <Link to="/admin-dashboard">Dashboard Admin</Link>
          </>
        )}
      </nav>

      <div className={styles.navbarActions}>
        {!user ? (
          <>
            <Link to="/login" className={styles.btnLogin}>
              Connexion
            </Link>
            <Link to="/register" className={styles.btnRegister}>
              Inscription
            </Link>
          </>
        ) : (
          <>
            <button
              className={styles.btnProfile}
              title="Profil"
              onClick={() => navigate("/profile")}
            >
              <img
                src="/assets/user-icon.png"
                alt="Profil"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                }}
              />
            </button>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className={styles.btnLogout}
            >
              Déconnexion
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
