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

  static async update(
    id,
    {
      titre,
      description,
      type_contrat,
      localisation,
      salaire,
      statut,
      company_id,
      user_id,
    }
  ) {
    const fields = [];
    const values = [];
    let i = 1;

    if (titre !== undefined) {
      fields.push(`titre = $${i++}`);
      values.push(titre);
    }
    if (description !== undefined) {
      fields.push(`description = $${i++}`);
      values.push(description);
    }
    if (type_contrat !== undefined) {
      fields.push(`type_contrat = $${i++}`);
      values.push(type_contrat);
    }
    if (localisation !== undefined) {
      fields.push(`localisation = $${i++}`);
      values.push(localisation);
    }
    if (salaire !== undefined) {
      fields.push(`salaire = $${i++}`);
      values.push(salaire);
    }
    if (statut !== undefined) {
      fields.push(`statut = $${i++}`);
      values.push(statut);
    }
    if (company_id !== undefined) {
      fields.push(`company_id = $${i++}`);
      values.push(company_id);
    }
    if (user_id !== undefined) {
      fields.push(`user_id = $${i++}`);
      values.push(user_id);
    }

    if (fields.length === 0) {
      // Rien à mettre à jour
      return null;
    }

    values.push(id); // pour WHERE id = $n
    const query = `UPDATE jobs SET ${fields.join(
      ", "
    )} WHERE id = $${i} RETURNING *`;

    try {
      const result = await pool.query(query, values);
      return result.rows[0]; // renvoie l'offre mise à jour
    } catch (err) {
      console.error("Erreur update Job :", err);
      throw err;
    }
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
