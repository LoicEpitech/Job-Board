const pool = require("../config/db");

class Application {
  static async getMainCvId(user_id) {
    const res = await pool.query(
      "SELECT id FROM cvs WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT 1",
      [user_id]
    );
    return res.rows[0]?.id || null;
  }

  static async applyToJob({ user_id, job_id, lettre_motivation }) {
    const cv_id = await Application.getMainCvId(user_id);
    if (!cv_id) {
      throw new Error("NO_CV");
    }
    // Par défaut, le statut est "en_attente"
    const statut = "en_attente";
    const result = await pool.query(
      `INSERT INTO applications (cv_id,user_id, job_id, lettre_motivation, statut, applied_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING *`,
      [cv_id, user_id, job_id, lettre_motivation, statut]
    );
    return result.rows[0];
  }

  // Récupérer les candidatures de l'utilisateur
  static async getMyApplications(user_id) {
    const result = await pool.query(
      `SELECT a.id, a.statut, a.applied_at, j.titre AS job_title
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.user_id = $1
       ORDER BY a.applied_at DESC`,
      [user_id]
    );
    return result.rows;
  }

  // Retirer une candidature
  static async withdrawApplication(id, user_id) {
    const result = await pool.query(
      `DELETE FROM applications
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, user_id]
    );
    return result.rowCount > 0;
  }

  static async getApplicationsForJob(job_id) {
    const result = await pool.query(
      `SELECT a.id, a.statut, a.applied_at, u.prenom, u.nom, u.email, a.lettre_motivation, c.fichier AS cv_file
       FROM applications a
       JOIN users u ON a.user_id = u.id
       LEFT JOIN cvs c ON a.cv_id = c.id
       WHERE a.job_id = $1`,
      [job_id]
    );
    return result.rows;
  }

  static async updateStatus(appId, statut) {
    const result = await pool.query(
      `UPDATE applications
       SET statut = $1
       WHERE id = $2
       RETURNING *`,
      [statut, appId]
    );
    return result.rows[0];
  }
}
module.exports = Application;

// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     prenom VARCHAR(100) NOT NULL,
//     nom VARCHAR(100) NOT NULL,
//     email VARCHAR(255) UNIQUE NOT NULL,
//     passe VARCHAR(255) NOT NULL,
//     date_naissance DATE,
//     pays VARCHAR(100),
//     ville VARCHAR(100),
//     code_postal VARCHAR(20),
//     tel VARCHAR(30),
//     adresse VARCHAR(255),
//     type VARCHAR(50) DEFAULT 'candidat', -- candidat / recruteur / admin
//     profile_cv_id INTEGER,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- ===========================================
// -- 🔹 TABLE cvs
// -- ===========================================
// CREATE TABLE cvs (
//     id SERIAL PRIMARY KEY,
//     fichier VARCHAR(255) NOT NULL,
//     titre VARCHAR(255),
//     user_id INTEGER NOT NULL,
//     uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     CONSTRAINT fk_cvs_user FOREIGN KEY (user_id)
//         REFERENCES users(id)
//         ON DELETE CASCADE
// );

// -- ===========================================
// -- 🔹 TABLE companies
// -- ===========================================
// CREATE TABLE companies (
//     id SERIAL PRIMARY KEY,
//     nom VARCHAR(255) NOT NULL,
//     secteur VARCHAR(255),
//     description TEXT,
//     site_web VARCHAR(255),
//     adresse VARCHAR(255),
//     ville VARCHAR(100),
//     code_postal VARCHAR(20),
//     pays VARCHAR(100),
//     tel VARCHAR(30),
//     email VARCHAR(255),
//     logo VARCHAR(255),
//     user_id INTEGER NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     CONSTRAINT fk_company_user FOREIGN KEY (user_id)
//         REFERENCES users(id)
//         ON DELETE CASCADE
// );

// -- ===========================================
// -- 🔹 TABLE jobs
// -- ===========================================
// CREATE TABLE jobs (
//     id SERIAL PRIMARY KEY,
//     titre VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     salaire DECIMAL(10,2),
//     type_contrat VARCHAR(100),
//     date_publication TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     date_expiration DATE,
//     localisation VARCHAR(255),
//     company_id INTEGER NOT NULL,
//     user_id INTEGER NOT NULL,
//     CONSTRAINT fk_job_company FOREIGN KEY (company_id)
//         REFERENCES companies(id)
//         ON DELETE CASCADE,
//     CONSTRAINT fk_job_user FOREIGN KEY (user_id)
//         REFERENCES users(id)
//         ON DELETE CASCADE
// );

// -- ===========================================
// -- 🔹 TABLE applications
// -- ===========================================
// CREATE TABLE applications (
//     id SERIAL PRIMARY KEY,
//     user_id INTEGER NOT NULL,
//     job_id INTEGER NOT NULL,
//     cv_id INTEGER,
//     applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     statut VARCHAR(50) DEFAULT 'En attente',
//     message TEXT,
//     CONSTRAINT fk_application_user FOREIGN KEY (user_id)
//         REFERENCES users(id)
//         ON DELETE CASCADE,
//     CONSTRAINT fk_application_job FOREIGN KEY (job_id)
//         REFERENCES jobs(id)
//         ON DELETE CASCADE,
//     CONSTRAINT fk_application_cv FOREIGN KEY (cv_id)
//         REFERENCES cvs(id)
//         ON DELETE SET NULL
// );
