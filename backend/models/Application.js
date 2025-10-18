const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Application {
  // Récupérer le CV principal de l'utilisateur
  static async getMainCvId(user_id) {
    const cv = await prisma.cvs.findFirst({
      where: { user_id: parseInt(user_id, 10) },
      orderBy: { uploaded_at: "desc" },
    });
    return cv?.id || null;
  }

  // Postuler à un job
  static async applyToJob({ user_id, job_id, lettre_motivation }) {
    const cv_id = await this.getMainCvId(user_id);
    if (!cv_id) throw new Error("NO_CV");

    return prisma.applications.create({
      data: {
        user_id: parseInt(user_id, 10),
        job_id: parseInt(job_id, 10),
        cv_id,
        lettre_motivation,
        statut: "en_attente",
        applied_at: new Date(),
      },
    });
  }

  // Récupérer les candidatures d'un utilisateur
  static async getMyApplications(user_id) {
    return prisma.applications.findMany({
      where: { user_id: parseInt(user_id, 10) },
      orderBy: { applied_at: "desc" },
      include: {
        jobs: { select: { titre: true } },
      },
    });
  }

  // Retirer une candidature
  static async withdrawApplication(id, user_id) {
    const deleted = await prisma.applications.deleteMany({
      where: { id: parseInt(id, 10), user_id: parseInt(user_id, 10) },
    });
    return deleted.count > 0;
  }

  // Récupérer toutes les candidatures pour un job
  static async getApplicationsForJob(job_id) {
    return prisma.applications.findMany({
      where: { job_id: parseInt(job_id, 10) },
      include: {
        users: { select: { prenom: true, nom: true, email: true } },
        cvs: { select: { fichier: true } },
      },
    });
  }

  // Mettre à jour le statut d'une candidature
  static async updateStatus(appId, statut) {
    return prisma.applications.update({
      where: { id: parseInt(appId, 10) },
      data: { statut },
    });
  }
}

module.exports = Application;
