import React from "react";
import "./modules/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-about">
          <h3>Job Board</h3>
          <p>
            Plateforme moderne pour trouver un emploi ou recruter facilement.
            Découvrez des offres variées et postulez en quelques clics !
          </p>
        </div>
        <div className="footer-links">
          <h4>Liens utiles</h4>
          <ul>
            <li>
              <a href="#">À propos</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Mentions légales</a>
            </li>
            <li>
              <a href="#">FAQ</a>
            </li>
          </ul>
        </div>
        <div className="footer-social">
          <h4>Suivez-nous</h4>
          <ul>
            <li>
              <a href="#">LinkedIn</a>
            </li>
            <li>
              <a href="#">Twitter</a>
            </li>
            <li>
              <a href="#">Facebook</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Job Board. Tous droits réservés.
      </div>
    </footer>
  );
}

export default Footer;
