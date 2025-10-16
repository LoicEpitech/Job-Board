const pool = require("../config/db");
class Company {
  static async getCompanies() {
    const result = await pool.query("SELECT * FROM companies");
    return result.rows;
  }

  static async getCompanyById(id) {
    const result = await pool.query("SELECT * FROM companies WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  }

  static async createCompany({
    nom,
    description,
    secteur_activite,
    site_web,
    pays,
    ville,
    code_postal,
    user_id,
    mail,
  }) {
    const result = await pool.query(
      "INSERT INTO companies (nom, description, secteur_activite, site_web, pays, ville, code_postal, user_id, mail) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        nom,
        description,
        secteur_activite,
        site_web,
        pays,
        ville,
        code_postal,
        user_id,
        mail,
      ]
    );
    return result.rows[0];
  }

  static async updateCompany(
    id,
    {
      nom,
      description,
      secteur_activite,
      site_web,
      pays,
      ville,
      code_postal,
      mail,
    }
  ) {
    const query = `
    UPDATE companies 
    SET nom = $1,
        description = $2,
        secteur_activite = $3,
        site_web = $4,
        pays = $5,
        ville = $6,
        code_postal = $7,
        mail = $8
    WHERE id = $9
    RETURNING *
  `;
    const values = [
      nom,
      description,
      secteur_activite,
      site_web,
      pays,
      ville,
      code_postal,
      mail,
      id,
    ];
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      throw err;
    }
  }

  static async deleteCompany(id) {
    const result = await pool.query("DELETE FROM companies WHERE id = $1", [
      id,
    ]);
    return result.rowCount > 0;
  }

  static async searchCompanies(CompaniesSearch) {
    const result = await pool.query(
      "SELECT * FROM companies WHERE nom ILIKE $1 OR secteur_activite ILIKE $1",
      [`%${CompaniesSearch}%`]
    );
    return result.rows;
  }
}

module.exports = Company;
