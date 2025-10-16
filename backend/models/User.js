const pool = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  //  Créer un utilisateur
  static async create({ prenom, nom, email, password, type }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (prenom, nom, email, mot_de_passe, type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [prenom, nom, email, hashedPassword, type]
    );
    return result.rows[0];
  }

  //  Chercher un utilisateur par email
  static async findByEmail(email) {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0] || null;
  }

  //  Chercher un utilisateur par id
  static async findById(userId) {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    return result.rows[0] || null;
  }

  //  Vérifier le mot de passe pour login
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.mot_de_passe);
  }

  static async addCV(userId, fichier, titre) {
    const cvResult = await pool.query(
      `INSERT INTO cvs (fichier, titre, user_id)
     VALUES ($1, $2, $3)
     RETURNING id`,
      [fichier, titre, userId]
    );

    const cvId = cvResult.rows[0].id;

    const userResult = await pool.query(
      `UPDATE users
     SET profile_cv_id = $1
     WHERE id = $2
     RETURNING id, prenom, nom, email, profile_cv_id`,
      [cvId, userId]
    );

    return userResult.rows[0];
  }

  //  Mettre à jour le profil (sans CV)
  static async updateProfile(userId, data) {
    const { prenom, nom, pays, ville, code_postal, tel, type } = data;

    const date_naissance =
      data.date_naissance === "" ? null : data.date_naissance;

    const result = await pool.query(
      `UPDATE users
       SET prenom = $1,
           nom = $2,
           date_naissance = $3,
           pays = $4,
           ville = $5,
           code_postal = $6,
           tel = $7,
           type = $8
       WHERE id = $9
       RETURNING id, prenom, nom, email, date_naissance, pays, ville, code_postal, tel, type, profile_cv_id`,
      [prenom, nom, date_naissance, pays, ville, code_postal, tel, type, userId]
    );

    return result.rows[0];
  }

  //  Changer le mot de passe
  static async changePassword(userId, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET mot_de_passe = $1 WHERE id = $2", [
      hashed,
      userId,
    ]);
    return true;
  }

  //  Supprimer un utilisateur
  static async deleteAccount(userId) {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    return true;
  }

  //  Mettre à jour le type de profil
  static async updateUserType(userId, type) {
    const result = await pool.query(
      "UPDATE users SET type = $1 WHERE id = $2 RETURNING id, prenom, nom, email, type",
      [type, userId]
    );
    return result.rows[0];
  }

  static async getAllCompanies() {
    const result = await pool.query(
      `SELECT * FROM companies c
      ORDER BY c.nom`
    );
    return result.rows;
  }

  static async find() {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

  static async updateCompanyProfile(req, user) {
    if (user.type === "recruteur") {
      const {
        entreprise_nom,
        entreprise_description,
        entreprise_secteur,
        entreprise_site,
        entreprise_pays,
        entreprise_mail,
        entreprise_ville,
        entreprise_code_postal,
      } = req.body;

      // Vérifie si la société existe déjà
      const company = await pool.query(
        "SELECT * FROM companies WHERE user_id = $1",
        [user.id]
      );

      if (company.rows.length > 0) {
        await pool.query(
          `UPDATE companies SET
          nom = $1,
          description = $2,
          secteur_activite = $3,
          site_web = $4,
          pays = $5,
          mail = $6,
          ville = $7,
          code_postal = $8
        WHERE user_id = $9`,
          [
            entreprise_nom,
            entreprise_description,
            entreprise_secteur,
            entreprise_site,
            entreprise_pays,
            entreprise_mail,
            entreprise_ville,
            entreprise_code_postal,
            user.id,
          ]
        );
      } else {
        // Crée
        await pool.query(
          `INSERT INTO companies
          (nom, description, secteur_activite, site_web, pays, mail, ville, code_postal, user_id)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            entreprise_nom,
            entreprise_description,
            entreprise_secteur,
            entreprise_site,
            entreprise_pays,
            entreprise_mail,
            entreprise_ville,
            entreprise_code_postal,
            user.id,
          ]
        );
      }
    }
  }

  // modifier un utilisateur (admin)
  static async update(userId, data) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }

    const query = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING prenom, nom, email, date_naissance, pays, ville, code_postal, tel, mot_de_passe, type, profile_cv_id, entreprise_id
  `;
    values.push(userId);

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // supprimer un utilisateur (admin)
  static async delete(userId) {
    await pool.query("DELETE FROM users WHERE id = $1", [userId]);
    return true;
  }

  // créer un utilisateur (admin)
  static async createAdmin({
    prenom,
    nom,
    email,
    date_naissance,
    pays,
    ville,
    code_postal,
    tel,
    password,
    type,
    profile_cv_id = null,
    entreprise_id = null,
  }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (
      prenom, nom, email, mot_de_passe, date_naissance, pays, ville, code_postal, tel, type, profile_cv_id, entreprise_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING id, prenom, nom, email, date_naissance, pays, ville, code_postal, tel, type, profile_cv_id, entreprise_id`,
      [
        prenom,
        nom,
        email,
        hashedPassword,
        date_naissance || null,
        pays || null,
        ville || null,
        code_postal || null,
        tel || null,
        type,
        profile_cv_id,
        entreprise_id,
      ]
    );
    return result.rows[0];
  }
}

module.exports = User;
