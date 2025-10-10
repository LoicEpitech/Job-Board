const pool = require("../config/db");

class Job {
  // Créer une offre
  static async create({
    titre,
    description,
    type_contrat,
    localisation,
    salaire,
    statut = "Ouvert",
    company_id,
    user_id,
  }) {
    const result = await pool.query(
      `INSERT INTO jobs (titre, description, type_contrat, localisation, salaire, posted_at, statut, company_id, user_id)
       VALUES ($1, $2, $3, $4, $5, NOW(), $6, $7, $8)
       RETURNING *`,
      [
        titre,
        description,
        type_contrat,
        localisation,
        salaire,
        statut,
        company_id,
        user_id,
      ]
    );
    return result.rows[0];
  }

  // Récupérer toutes les offres
  static async getAll() {
    const result = await pool.query(
      `SELECT j.*, c.nom AS company_name
       FROM jobs j
       LEFT JOIN companies c ON j.company_id = c.id
       ORDER BY j.posted_at DESC`
    );
    return result.rows;
  }

  // Récupérer une offre par id
  static async getById(id) {
    const result = await pool.query(
      "SELECT j.*, c.nom AS company_name FROM jobs j LEFT JOIN companies c ON j.company_id = c.id WHERE j.id = $1",
      [id]
    );
    return result.rows[0];
  }

  // Modifier une offre
  static async update(id, fields) {
    const { titre, description, type_contrat, localisation, salaire, statut } =
      fields;
    const result = await pool.query(
      `UPDATE jobs
       SET titre = $1, description = $2, type_contrat = $3, localisation = $4, salaire = $5, statut = $6
       WHERE id = $7
       RETURNING *`,
      [titre, description, type_contrat, localisation, salaire, statut, id]
    );
    return result.rows[0];
  }

  // Supprimer une offre
  static async delete(id) {
    const result = await pool.query(
      `DELETE FROM jobs WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  static async getCompanyIdByUserId(user_id) {
    const result = await pool.query(
      "SELECT id FROM companies WHERE user_id = $1",
      [user_id]
    );
    return result.rows[0]?.id || null;
  }

  static async getByUserId(userId) {
    const result = await pool.query(
      "SELECT * FROM jobs WHERE user_id = $1 ORDER BY posted_at DESC",
      [userId]
    );
    return result.rows;
  }
}

module.exports = Job;

// CREATE TABLE jobs (
//     id SERIAL PRIMARY KEY,
//     titre VARCHAR(255) NOT NULL,
//     description TEXT NOT NULL,
//     type_contrat VARCHAR(255) NOT NULL, -- CDI, CDD, Freelance, Stage...
//     localisation VARCHAR(255) NOT NULL,
//     salaire VARCHAR(100),
//     posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     statut VARCHAR(50) DEFAULT 'Ouvert', -- Ouvert, Fermer
//     company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
//     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
// );
