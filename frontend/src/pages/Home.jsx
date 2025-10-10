// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "./modules/home.module.css";

function Home() {
  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <h1>Bienvenue sur JobBoard</h1>
        <p>
          Découvrez des milliers d’offres d’emploi et trouvez votre futur job !
        </p>
        <Link to="/jobs" className={styles.btnPrimary}>
          Voir les offres
        </Link>
      </section>

      <section className={styles.features}>
        <div className={styles.feature}>
          <h3>Des offres mises à jour</h3>
          <p>Trouvez rapidement des offres correspondant à votre profil.</p>
        </div>
        <div className={styles.feature}>
          <h3>Postulez facilement</h3>
          <p>Créez un profil et postulez en quelques clics.</p>
        </div>
        <div className={styles.feature}>
          <h3>Entreprises vérifiées</h3>
          <p>Travaillez avec des entreprises fiables et reconnues.</p>
        </div>
      </section>
    </div>
  );
}

export default Home;
