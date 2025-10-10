import { useEffect, useState } from "react";
import styles from "./modules/Jobs.module.css";
import { useNavigate } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { getAllJobs } from "../services/jobService";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [typeContrat, setTypeContrat] = useState("");
  const [salaryRange, setSalaryRange] = useState([0, 5000]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllJobs()
      .then((data) => {
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur de chargement :", err);
        setLoading(false);
      });
  }, []);

  const salaries = jobs
    .map((job) => parseInt(job.salaire, 10))
    .filter((s) => !isNaN(s));
  const minPossibleSalary = salaries.length ? Math.min(...salaries) : 0;
  const maxPossibleSalary = salaries.length ? Math.max(...salaries) : 5000;

  useEffect(() => {
    setSalaryRange([minPossibleSalary, maxPossibleSalary]);
  }, [minPossibleSalary, maxPossibleSalary]);

  const toggleJob = (id) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchTitle = job.titre.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location
      ? job.localisation.toLowerCase().includes(location.toLowerCase())
      : true;
    const matchType = typeContrat ? job.type_contrat === typeContrat : true;
    const salaireNum = parseInt(job.salaire, 10);
    const matchSalary =
      !isNaN(salaireNum) &&
      salaireNum >= salaryRange[0] &&
      salaireNum <= salaryRange[1];
    return matchTitle && matchLocation && matchType && matchSalary;
  });

  const handlePostuler = (jobId) => {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") {
      navigate("/login");
    } else {
      navigate(`/jobs/${jobId}`);
    }
  };

  if (loading) {
    return (
      <div className={styles["jobs-container"]}>
        <h1 className={styles["jobs-title"]}>💼 Offres d'emploi disponibles</h1>
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          Chargement des offres...
        </div>
      </div>
    );
  }
  return (
    <div className={styles["jobs-container"]}>
      <h1 className={styles["jobs-title"]}>💼 Offres d'emploi disponibles</h1>

      <div className={styles["jobs-filters"]}>
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Localisation..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <select
          value={typeContrat}
          onChange={(e) => setTypeContrat(e.target.value)}
        >
          <option value="">Tous les contrats</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
          <option value="Alternance">Alternance</option>
        </select>

        <div style={{ minWidth: 220, flex: 1 }}>
          <label>
            Salaire&nbsp;
            <span>{salaryRange[0]} €</span> — <span>{salaryRange[1]} €</span>
          </label>
          <Slider
            range
            min={minPossibleSalary}
            max={maxPossibleSalary}
            value={salaryRange}
            onChange={setSalaryRange}
            allowCross={false}
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <p className={styles["no-jobs"]}>Aucune offre pour le moment...</p>
      ) : (
        <div className={styles["jobs-grid"]}>
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`${styles["job-card"]} ${
                expandedJobId === job.id ? styles.expanded : ""
              }`}
              onClick={() => toggleJob(job.id)}
            >
              <div className={styles["job-header"]}>
                <h2>{job.titre}</h2>
                {job.company_name && (
                  <span className={styles["company-name"]}>
                    {job.company_name}
                  </span>
                )}
              </div>

              <div className={styles["job-meta"]}>
                <span className={styles.tag}>{job.type_contrat}</span>
                <span className={`${styles.tag} ${styles.location}`}>
                  {job.localisation}
                </span>
                <span className={`${styles.tag} ${styles.salary}`}>
                  {job.salaire}
                </span>
              </div>

              {expandedJobId === job.id && (
                <div className={styles["job-description"]}>
                  <h3>Description du poste</h3>
                  <p>{job.description || "Aucune description disponible."}</p>
                  <button onClick={() => handlePostuler(job.id)}>
                    Postuler
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;
