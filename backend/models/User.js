const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

class User {
  // pour convertir une chaîne en Date compatible Prisma
  static parseDate(value) {
    if (!value) return null;
    const s = String(value).trim();
    // format YYYY-MM-DD -> construire une Date en locale (évite décalage UTC)
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [y, m, d] = s.split("-").map(Number);
      return new Date(y, m - 1, d);
    }
    // autre format : essayer de parser
    const dt = new Date(s);
    return isNaN(dt) ? null : dt;
  }

  //  Créer un utilisateur
  static async create({ prenom, nom, email, password, type }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        prenom,
        nom,
        email,
        mot_de_passe: hashedPassword,
        type,
      },
    });
    return user;
  }

  //  Chercher un utilisateur par email
  static async findByEmail(email) {
    return await prisma.users.findUnique({
      where: { email },
    });
  }

  //  Chercher un utilisateur par ID
  static async findById(id) {
    return await prisma.users.findUnique({
      where: { id },
    });
  }

  //  Vérifier le mot de passe
  static async verifyPassword(user, password) {
    return await bcrypt.compare(password, user.mot_de_passe);
  }

  //  Ajouter un CV et l’associer à l’utilisateur
  static async addCV(userId, fichier, titre) {
    const cv = await prisma.cvs.create({
      data: {
        fichier,
        titre,
        user_id: userId,
      },
    });

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: { profile_cv_id: cv.id },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        profile_cv_id: true,
      },
    });

    return updatedUser;
  }

  //  Mettre à jour le profil utilisateur
  static async updateProfile(userId, data) {
    const { prenom, nom, date_naissance, pays, ville, code_postal, tel, type } =
      data;

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        prenom,
        nom,
        date_naissance: User.parseDate(date_naissance) || null,
        pays,
        ville,
        code_postal,
        tel,
        type,
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        email: true,
        date_naissance: true,
        pays: true,
        ville: true,
        code_postal: true,
        tel: true,
        type: true,
        profile_cv_id: true,
      },
    });

    return updatedUser;
  }

  //  Changer le mot de passe
  static async changePassword(userId, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.users.update({
      where: { id: userId },
      data: { mot_de_passe: hashed },
    });
    return true;
  }

  //  Supprimer un compte
  static async deleteAccount(userId) {
    await prisma.users.delete({ where: { id: userId } });
    return true;
  }

  //  Modifier le type d'utilisateur
  static async updateUserType(userId, type) {
    return await prisma.users.update({
      where: { id: userId },
      data: { type },
      select: { id: true, prenom: true, nom: true, email: true, type: true },
    });
  }

  //  Récupérer toutes les entreprises
  static async getAllCompanies() {
    return await prisma.companies.findMany({
      orderBy: { nom: "asc" },
    });
  }

  //  Récupérer tous les utilisateurs (admin)
  static async find() {
    return await prisma.users.findMany();
  }

  //  Mettre à jour le profil d'entreprise
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

      const existingCompany = await prisma.companies.findFirst({
        where: { user_id: user.id },
      });

      if (existingCompany) {
        await prisma.companies.update({
          where: { id: existingCompany.id },
          data: {
            nom: entreprise_nom,
            description: entreprise_description,
            secteur_activite: entreprise_secteur,
            site_web: entreprise_site,
            pays: entreprise_pays,
            mail: entreprise_mail,
            ville: entreprise_ville,
            code_postal: entreprise_code_postal,
          },
        });
      } else {
        await prisma.companies.create({
          data: {
            nom: entreprise_nom,
            description: entreprise_description,
            secteur_activite: entreprise_secteur,
            site_web: entreprise_site,
            pays: entreprise_pays,
            mail: entreprise_mail,
            ville: entreprise_ville,
            code_postal: entreprise_code_postal,
            user_id: user.id,
          },
        });
      }
    }
  }

  //  Créer un utilisateur (admin)
  static async createAdmin(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await prisma.users.create({
      data: {
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        mot_de_passe: hashedPassword,
        date_naissance: User.parseDate(data.date_naissance) || null,
        pays: data.pays || null,
        ville: data.ville || null,
        code_postal: data.code_postal || null,
        tel: data.tel || null,
        type: data.type,
        profile_cv_id: data.profile_cv_id || null,
        entreprise_id: data.entreprise_id || null,
      },
    });
  }

  //  Modifier un utilisateur (admin)
  static async update(userId, data) {
    return await prisma.users.update({
      where: { id: parseInt(userId) },
      data,
    });
  }

  //  Supprimer un utilisateur (admin)
  static async delete(userId) {
    await prisma.users.delete({ where: { id: parseInt(userId) } });
    return true;
  }
}

module.exports = User;
