const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Company {
  static async getCompanies() {
    return prisma.companies.findMany({
      orderBy: { nom: "asc" },
    });
  }

  static async getCompanyById(id) {
    return prisma.companies.findUnique({
      where: { id: parseInt(id, 10) },
    });
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
    return prisma.companies.create({
      data: {
        nom,
        description,
        secteur_activite,
        site_web,
        pays,
        ville,
        code_postal,
        user_id,
        mail,
      },
    });
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
    return prisma.companies.update({
      where: { id: parseInt(id, 10) },
      data: {
        nom,
        description,
        secteur_activite,
        site_web,
        pays,
        ville,
        code_postal,
        mail,
      },
    });
  }

  static async deleteCompany(id) {
    await prisma.companies.delete({
      where: { id: parseInt(id, 10) },
    });
    return true;
  }

  static async searchCompanies(query) {
    return prisma.companies.findMany({
      where: {
        OR: [
          { nom: { contains: query, mode: "insensitive" } },
          { secteur_activite: { contains: query, mode: "insensitive" } },
        ],
      },
      orderBy: { nom: "asc" },
    });
  }
}

module.exports = Company;
