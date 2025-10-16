// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import styles from "./modules/Profile.module.css";

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    date_naissance: "",
    pays: "",
    ville: "",
    code_postal: "",
    tel: "",
    profile_cv_id: null,
    type: "",
    entreprise_id: null,
    entreprise_nom: "",
    entreprise_description: "",
    entreprise_secteur: "",
    entreprise_site: "",
    entreprise_pays: "",
    entreprise_ville: "",
    entreprise_code_postal: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [companyCities, setCompanyCities] = useState([]);
  const [cvErrorMsg, setCvErrorMsg] = useState("");
  const [showCreateCompany, setShowCreateCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" ou "error"
  const [companySearch, setCompanySearch] = useState("");
  const [companyResults, setCompanyResults] = useState([]);

  // 🔹 Fonction utilitaire pour lire le localStorage sans erreur
  const safeParse = (value) => {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    // 1️⃣ On tente d'abord de charger depuis le localStorage
    const storedUser = safeParse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData(storedUser);
    }

    // 2️⃣ On vérifie si on a un token valide
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    // 3️⃣ On appelle le backend pour rafraîchir les infos du profil
    fetch("/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          console.error("Erreur HTTP :", res.status);
          return;
        }
        const data = await res.json();

        if (data) {
          setUser(data);
          setFormData({
            prenom: data.prenom || "",
            nom: data.nom || "",
            email: data.email || "",
            date_naissance: data.date_naissance || "",
            pays: data.pays || "",
            ville: data.ville || "",
            code_postal: data.code_postal || "",
            tel: data.tel || "",
            profile_cv_id: data.profile_cv_id || null,
            type: data.type || "",
            entreprise_nom: data.entreprise_nom || "",
            entreprise_description: data.entreprise_description || "",
            entreprise_secteur: data.entreprise_secteur || "",
            entreprise_site: data.entreprise_site || "",
            entreprise_pays: data.entreprise_pays || "",
            entreprise_ville: data.entreprise_ville || "",
            entreprise_code_postal: data.entreprise_code_postal || "",
          });
          localStorage.setItem("user", JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.error("Erreur de récupération du profil :", err);
      })
      .finally(() => setLoading(false));
  }, []);

  // ✅ 3. Charger la liste des pays
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCountries(
            data
              .map((c) => (c.name && c.name.common ? c.name.common : null))
              .filter(Boolean)
              .sort()
          );
        } else {
          setCountries([]);
        }
      })
      .catch(() => setCountries([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleCityInput = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, ville: value });
    if (value.length > 2) {
      const res = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${value}&fields=nom,codesPostaux&boost=population&limit=5`
      );
      const data = await res.json();
      setCities(data);
    }
  };

  const handleCitySelect = (city) => {
    setFormData({
      ...formData,
      ville: city.nom,
      code_postal: city.codesPostaux[0] || "",
    });
    setCities([]);
  };

  const handleCompanyCityInput = async (e) => {
    const value = e.target.value;
    setFormData({ ...formData, entreprise_ville: value });
    if (value.length > 2) {
      const res = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${value}&fields=nom,codesPostaux&boost=population&limit=5`
      );
      const data = await res.json();
      setCompanyCities(data);
    } else {
      setCompanyCities([]);
    }
  };

  const handleCompanyCitySelect = (city) => {
    setFormData({
      ...formData,
      entreprise_ville: city.nom,
      entreprise_code_postal: city.codesPostaux[0] || "",
    });
    setCompanyCities([]);
  };

  const handleSave = async () => {
    // Crée une copie du formData sans les champs entreprise si non modifiés
    const dataToSend = { ...formData };

    // Si companySearch est vide ou inchangé, retire les champs entreprise
    if (!companySearch) {
      delete dataToSend.entreprise_id;
      delete dataToSend.entreprise_nom;
      delete dataToSend.entreprise_description;
      delete dataToSend.entreprise_secteur;
      delete dataToSend.entreprise_site;
      delete dataToSend.entreprise_pays;
      delete dataToSend.entreprise_ville;
      delete dataToSend.entreprise_code_postal;
    }

    try {
      const response = await fetch("/api/users/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Profil mis à jour !");
        setMessageType("success");
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
        setIsEditing(false);
      } else {
        setMessage(data.message || "Erreur lors de la mise à jour");
        setMessageType("error");
      }
    } catch (err) {
      setMessage("Erreur de communication avec le serveur");
      setMessageType("error");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword) {
      setMessage("Entrez un nouveau mot de passe");
      setMessageType("error");
      return;
    }
    const response = await fetch("/api/users/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ password: newPassword }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage("Mot de passe changé !");
      setMessageType("success");
      setNewPassword("");
    } else {
      setMessage(data.message);
      setMessageType("error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      return;
    }
    const response = await fetch("/api/users/delete", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (response.ok) {
      setMessage("Compte supprimé");
      setMessageType("success");
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      setMessage("Erreur lors de la suppression du compte");
      setMessageType("error");
    }
  };

  const handleFileUpload = async (file) => {
    setCvErrorMsg("");
    if (!file) {
      setCvErrorMsg("Aucun fichier sélectionné");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("cv", file);
    formDataToSend.append("titre", file.name);

    try {
      const response = await fetch("/api/users/upload-cv", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("CV uploadé avec succès !");
        setMessageType("success");
        setFormData((prev) => ({
          ...prev,
          profile_cv_id: data.user.profile_cv_id,
        }));
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setCvErrorMsg(data.message || "Erreur lors de l'upload du CV");
      }
    } catch (err) {
      setCvErrorMsg("Erreur de communication avec le serveur");
    }
  };

  if (loading) return <p>Chargement du profil...</p>;
  if (!user) return <p>Veuillez vous connecter pour voir votre profil.</p>;

  return (
    <div className={styles.profileContainer}>
      <h1>Mon Profil</h1>
      <div className={styles.section}>
        <h2>Informations personnelles</h2>
        <div className={styles.infoGrid}>
          <label>Prénom :</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <label>Nom :</label>
          <input
            type="text"
            name="nom"
            value={formData.nom || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <label>Email :</label>
          <input type="email" value={formData.email || ""} disabled />

          <label>Date de naissance :</label>
          <input
            type="date"
            name="date_naissance"
            value={formatDate(formData.date_naissance) || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Pays :</label>
          <input
            list="country-list"
            name="pays"
            value={formData.pays || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <datalist id="country-list">
            {countries.map((country) => (
              <option key={country} value={country} />
            ))}
          </datalist>

          <label>Ville :</label>
          <input
            type="text"
            name="ville"
            value={formData.ville || ""}
            onChange={handleCityInput}
            disabled={!isEditing}
          />
          {cities.length > 0 && (
            <ul>
              {cities.map((city) => (
                <li key={city.nom} onClick={() => handleCitySelect(city)}>
                  {city.nom} ({city.codesPostaux[0]})
                </li>
              ))}
            </ul>
          )}

          <label>Code postal :</label>
          <input
            type="text"
            name="code_postal"
            value={formData.code_postal || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />

          <label>Téléphone :</label>
          <input
            type="text"
            name="tel"
            value={formData.tel || ""}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {formData.type === "candidat" && (
          <>
            <label>profile_cv_id (PDF uniquement) :</label>
            <input
              type="file"
              name="cv"
              accept=".pdf"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              disabled={!isEditing}
            />
          </>
        )}

        {message && (
          <div
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              borderRadius: "8px",
              color: messageType === "success" ? "#15803d" : "#b91c1c",
              background: messageType === "success" ? "#f0fdf4" : "#fef2f2",
              border: `2px solid ${
                messageType === "success" ? "#86efac" : "#fca5a5"
              }`,
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        )}

        {formData.type === "recruteur" && (
          <div className={styles.section}>
            <h2>Informations sur l'entreprise</h2>

            {!showCreateCompany ? (
              <div className={styles.infoGrid}>
                <label>Rechercher une entreprise:</label>
                <input
                  type="text"
                  value={companySearch}
                  onChange={async (e) => {
                    setCompanySearch(e.target.value);
                    if (e.target.value.length > 2) {
                      const token = localStorage.getItem("token");
                      const res = await fetch(
                        `/api/companies/searchCompanies?query=${e.target.value}`,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        }
                      );

                      const data = await res.json();
                      setCompanyResults(data.companies || []);
                    } else {
                      setCompanyResults([]);
                    }
                  }}
                  disabled={!isEditing}
                  placeholder="Nom de l'entreprise"
                />
                {companyResults.length > 0 && (
                  <ul className={styles.companyResults}>
                    {companyResults.map((company) => (
                      <li
                        key={company.id}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            entreprise_nom: company.nom,
                            entreprise_id: company.id,
                            entreprise_pays: company.pays,
                            entreprise_ville: company.ville,
                            entreprise_code_postal: company.code_postal,
                            entreprise_description: company.description,
                            entreprise_secteur: company.secteur,
                            entreprise_site: company.site,
                          });
                          setCompanySearch(company.nom);
                          setCompanyResults([]);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {company.nom} ({company.ville}, {company.pays})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className={styles.infoGrid}>
                <h3>Créer une nouvelle entreprise</h3>
                <button
                  type="button"
                  onClick={() => setShowCreateCompany(false)}
                  style={{ marginBottom: "1rem" }}
                >
                  Annuler
                </button>
                <label>Nom de l'entreprise :</label>
                <input
                  type="text"
                  name="entreprise_nom"
                  value={formData.entreprise_nom || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <label>Pays :</label>
                <input
                  list="company-country-list"
                  name="entreprise_pays"
                  value={formData.entreprise_pays || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <datalist id="company-country-list">
                  {countries.map((country) => (
                    <option key={country} value={country} />
                  ))}
                </datalist>
                <label>Ville :</label>
                <input
                  type="text"
                  name="entreprise_ville"
                  value={formData.entreprise_ville || ""}
                  onChange={handleCompanyCityInput}
                  disabled={!isEditing}
                />
                {companyCities.length > 0 && (
                  <ul>
                    {companyCities.map((city) => (
                      <li
                        key={city.nom}
                        onClick={() => handleCompanyCitySelect(city)}
                      >
                        {city.nom} ({city.codesPostaux[0]})
                      </li>
                    ))}
                  </ul>
                )}
                <label>Code postal :</label>
                <input
                  type="text"
                  name="entreprise_code_postal"
                  value={formData.entreprise_code_postal || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <label>Description :</label>
                <textarea
                  name="entreprise_description"
                  value={formData.entreprise_description || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <label>Secteur d'activité :</label>
                <input
                  type="text"
                  name="entreprise_secteur"
                  value={formData.entreprise_secteur || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                <label>Site web :</label>
                <input
                  type="text"
                  name="entreprise_site"
                  value={formData.entreprise_site || ""}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>
            )}

            {/* Bouton pour basculer sur le formulaire de création */}
            {!showCreateCompany && (
              <button
                type="button"
                className={styles.createCompanyBtn}
                onClick={() => setShowCreateCompany(true)}
                style={{ marginBottom: "1rem" }}
              >
                Entreprise pas répertoriée ?
              </button>
            )}
          </div>
        )}

        <div className={styles.actions}>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Modifier</button>
          ) : (
            <button onClick={handleSave}>Enregistrer</button>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2>Paramètres du compte</h2>
        <div className={styles.passwordSection}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handlePasswordChange}>
            Changer le mot de passe
          </button>
        </div>
        <button className={styles.deleteBtn} onClick={handleDeleteAccount}>
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

export default Profile;
