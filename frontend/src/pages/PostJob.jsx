import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/jobService";
import "./modules/PostJob.css";

function PostJob() {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    localisation: "",
    salaire: "",
    type_contrat: "",
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCityInput = async (e) => {
    const value = e.target.value;
    setForm({ ...form, localisation: value });
    if (value.length > 2) {
      const res = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${value}&fields=nom,code&limit=5`
      );
      const data = await res.json();
      setCities(data);
    } else setCities([]);
  };

  const handleCitySelect = (city) => {
    setForm({ ...form, localisation: city.nom });
    setCities([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const token = localStorage.getItem("token");
    try {
      await createJob(form, token);
      setMessage("Offre créée avec succès !");
      setMessageType("success");
      setForm({
        titre: "",
        description: "",
        localisation: "",
        salaire: "",
        type_contrat: "",
      });
      navigate("/my-jobs");
    } catch (err) {
      setMessage("Erreur lors de la création");
      setMessageType("error");
    }
  };

  return (
    <div className="postJobContainer">
      <div className="postJobWrapper">
        <h2>Créer une offre d'emploi</h2>
        <form className="postJobForm" onSubmit={handleSubmit}>
          <label>Titre :</label>
          <input
            name="titre"
            value={form.titre}
            onChange={handleChange}
            required
          />

          <label>Description :</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />

          <label>Lieu :</label>
          <input
            name="localisation"
            value={form.localisation}
            onChange={handleCityInput}
            autoComplete="off"
            required
          />
          {cities.length > 0 && (
            <ul className="citySuggestions">
              {cities.map((city) => (
                <li key={city.code} onClick={() => handleCitySelect(city)}>
                  {city.nom}
                </li>
              ))}
            </ul>
          )}

          <label>Salaire :</label>
          <select
            name="salaire"
            value={form.salaire}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner</option>
            <option value="-1000">Moins de 1000 €</option>
            <option value="1000-1500">1000 - 1500 €</option>
            <option value="1500-2000">1500 - 2000 €</option>
            <option value="2000-2500">2000 - 2500 €</option>
            <option value="2500+">Plus de 2500 €</option>
          </select>

          <label>Type de contrat :</label>
          <select
            name="type_contrat"
            value={form.type_contrat}
            onChange={handleChange}
            required
          >
            <option value="">Sélectionner</option>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Alternance">Alternance</option>
          </select>

          <button type="submit" className="submitBtn">
            Publier l'offre
          </button>
          {message && <div className={`message ${messageType}`}>{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default PostJob;
