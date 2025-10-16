import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./modules/JobDetail.module.css";
import { getJobById, applyToJob } from "../services/jobService";

function JobDetail() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [motivation, setMotivation] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  if (!token) {
    setMessage("Vous devez être connecté pour postuler !");
    setMessageType("error");
    navigate("/login");
    return;
  }

  useEffect(() => {
    setLoading(true);
    getJobById(jobId)
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch(() => {
        setJob(null);
        setLoading(false);
      });
  }, [jobId]);

  const handleApply = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");
    const token = localStorage.getItem("token");
    try {
      await applyToJob(jobId, motivation, token);
      setMessage("Candidature bien envoyée !");
      setMessageType("success");
      setMotivation("");
      setTimeout(() => navigate("/jobs"), 3000);
    } catch (err) {
      if (err.status === 400 && err.message) {
        setMessage(err.message);
        setMessageType("error");
        setTimeout(() => {
          if (err.redirect) navigate(err.redirect);
        }, 3000);
      } else if (err.status === 401 && err.message) {
        setMessage(err.message);
        setMessageType("error");
      } else {
        setMessage("Erreur lors de la candidature");
        setMessageType("error");
      }
    }
  };

  if (loading) {
    return (
      <div className={styles["detail-container"]}>
        <div
          className={styles["detail-card"]}
          style={{ textAlign: "center", padding: "3rem" }}
        >
          <div className={styles["spinner"]}></div>
          <div>Chargement de l'offre...</div>
        </div>
      </div>
    );
  }
  if (!job) return <div>Offre introuvable.</div>;

  return (
    <div className={styles["detail-container"]}>
      <div className={styles["detail-card"]}>
        <h1>{job.titre}</h1>
        {job.company_name && <h2>{job.company_name}</h2>}
        <div className={styles["detail-meta"]}>
          <strong>Type de contrat :</strong> {job.type_contrat} <br />
          <strong>Lieu :</strong> {job.localisation} <br />
          <strong>Salaire :</strong> {job.salaire}
        </div>
        <div className={styles["detail-description"]}>
          <strong>Description :</strong>
          <p>{job.description || "Aucune description disponible."}</p>
        </div>
        <form className={styles["detail-form"]} onSubmit={handleApply}>
          <label htmlFor="motivation">Lettre de motivation :</label>
          <textarea
            id="motivation"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
            rows={5}
            required
          />
          <button type="submit">Envoyer ma candidature</button>
        </form>
        {message && (
          <div
            className={styles["detail-message"]}
            style={{
              backgroundColor:
                messageType === "success" ? "#f0fdf4" : "#fef2f2",
              color: messageType === "success" ? "#15803d" : "#b91c1c",
              border: `2px solid ${
                messageType === "success" ? "#86efac" : "#fca5a5"
              }`,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobDetail;
