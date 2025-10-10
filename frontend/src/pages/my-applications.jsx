import React, { useEffect, useState } from "react";
import { getMyApplications } from "../services/applicationService";
import "./modules/my-applications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = await getMyApplications(token);
        setApplications(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading)
    return (
      <div className="applicationsContainer">
        <div className="applicationsWrapper">
          <p className="loading">Chargement...</p>
        </div>
      </div>
    );

  return (
    <div className="applicationsContainer">
      <div className="applicationsWrapper">
        <h2>Mes candidatures</h2>
        {applications.length === 0 ? (
          <p className="noApplications">Aucune candidature trouvée.</p>
        ) : (
          <ul className="applicationsList">
            {applications.map((app) => (
              <li className="applicationItem" key={app.id}>
                <strong>{app.job_title}</strong>
                <span
                  className={`statusBadge ${
                    app.statut === "acceptée"
                      ? "accepted"
                      : app.statut === "refusée"
                      ? "rejected"
                      : "pending"
                  }`}
                >
                  {app.statut}
                </span>
                <span className="applicationDate">
                  {new Date(app.applied_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyApplications;
