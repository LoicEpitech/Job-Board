import React from "react";
import "./modules/Forbidden.css";
import { useNavigate } from "react-router-dom";

function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="forbidden-container">
      <div className="forbidden-overlay">
        <h1>Accès interdit</h1>
        <p>Vous n'avez pas les droits pour accéder à cette page.</p>
        <button className="btn" onClick={() => navigate("/")}>
          Retour
        </button>
      </div>
    </div>
  );
}

export default Forbidden;
