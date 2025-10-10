import React, { useEffect, useState } from "react";
import {
  getMyJobs,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../services/jobService";
import styles from "./modules/my-jobs.module.css";

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [expandedAppId, setExpandedAppId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getMyJobs(token);
        setJobs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleJobClick = async (jobId) => {
    setSelectedJobId(jobId);
    setLoadingApps(true);
    try {
      const token = localStorage.getItem("token");
      const data = await getApplicationsForJob(jobId, token);
      console.log("Réponse brute du backend :", data);

      // 🔧 Ici, on force applications à être un tableau quoi qu’il arrive :
      const appsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.applications)
        ? data.applications
        : [];

      setApplications(appsArray);
    } catch (error) {
      console.error(error);
      setApplications([]);
    } finally {
      setLoadingApps(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await updateApplicationStatus(appId, newStatus, token);
      setApplications((apps) =>
        apps.map((app) =>
          app.id === appId ? { ...app, statut: newStatus } : app
        )
      );
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  if (loading)
    return (
      <div className={styles.jobsContainer}>
        <div className={styles.jobsWrapper}>
          <p className={styles.loading}>Chargement...</p>
        </div>
      </div>
    );

  return (
    <div className={styles.jobsContainer}>
      <div className={styles.jobsWrapper}>
        <h2>Mes offres créées</h2>
        {jobs.length === 0 ? (
          <p className={styles.noJobs}>Aucune offre créée.</p>
        ) : (
          <ul className={styles.jobsList}>
            {jobs.map((job) => (
              <li
                className={`${styles.jobItem}${
                  selectedJobId === job.id ? " " + styles.selected : ""
                }`}
                key={job.id}
                onClick={() => handleJobClick(job.id)}
                style={{ cursor: "pointer" }}
              >
                <strong>{job.titre}</strong>
                <span className={styles.jobDate}>
                  {new Date(job.posted_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}

        {selectedJobId && (
          <div className={styles.applicationsForJob}>
            <h3>Candidatures pour cette offre</h3>
            {loadingApps ? (
              <p className={styles.loading}>Chargement des candidatures...</p>
            ) : applications.length === 0 ? (
              <p className={styles.noApplications}>Aucune candidature reçue.</p>
            ) : (
              <ul className={styles.applicationsList}>
                {applications.map((app) => (
                  <li
                    className={`${styles.applicationItem} ${
                      expandedAppId === app.id ? styles.expanded : ""
                    }`}
                    key={app.id}
                    onClick={() =>
                      setExpandedAppId(expandedAppId === app.id ? null : app.id)
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <strong>
                      {app.nom} {app.prenom}
                    </strong>
                    <span
                      className={
                        styles.statusBadge +
                        " " +
                        (app.statut === "acceptée"
                          ? styles.accepted
                          : app.statut === "refusée"
                          ? styles.rejected
                          : styles.pending)
                      }
                    >
                      {app.statut}
                    </span>
                    <span className={styles.applicationDate}>
                      {new Date(app.applied_at).toLocaleDateString()}
                    </span>

                    {expandedAppId === app.id && (
                      <div className={styles.applicationDetails}>
                        <table className={styles.detailsTable}>
                          <tbody>
                            <tr>
                              <td>Email :</td>
                              <td>{app.email}</td>
                            </tr>
                            <tr>
                              <td>Lettre de motivation :</td>
                              <td>{app.lettre_motivation}</td>
                            </tr>
                            <tr>
                              <td>CV :</td>
                              <td>
                                {app.cv_file ? (
                                  <a
                                    href={`http://localhost:5000${app.cv_file}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Voir le CV
                                  </a>
                                ) : (
                                  "Aucun CV"
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <div className={styles.statusActions}>
                          <button
                            className={styles.acceptBtn}
                            onClick={() =>
                              handleUpdateStatus(app.id, "acceptée")
                            }
                            disabled={app.statut === "acceptée"}
                          >
                            Accepter
                          </button>
                          <button
                            className={styles.rejectBtn}
                            onClick={() =>
                              handleUpdateStatus(app.id, "refusée")
                            }
                            disabled={app.statut === "refusée"}
                          >
                            Refuser
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyJobs;
