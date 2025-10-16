//error 404 page not found
import React from "react";
import { Link } from "react-router-dom";
import "./modules/Forbidden.css";

export default function NotFound() {
  return (
    <div className="forbidden-container">
      <div className="forbidden-overlay">
        <h1>Page non trouvée</h1>
        <p>Désolé, la page que vous recherchez n'existe pas.</p>
        <Link to="/" className="btn">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
