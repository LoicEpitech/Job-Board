const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Récupérer toutes les offres
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await prisma.jobs.findMany({
      include: {
        companies: true,
        users: true,
      },
      orderBy: { posted_at: "desc" },
    });
    res.json({ jobs });
  } catch (err) {
    console.error("Erreur getAllJobs :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Récupérer une offre par ID
exports.getJobById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id))
    return res.status(400).json({ message: "ID d'offre invalide" });

  try {
    const job = await prisma.jobs.findUnique({
      where: { id },
      include: { companies: true, users: true },
    });
    if (!job) return res.status(404).json({ message: "Offre non trouvée" });
    res.json({ job });
  } catch (err) {
    console.error("Erreur getJobById :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Créer une offre
exports.createJob = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Récupérer l'entreprise de l'utilisateur
    const company = await prisma.companies.findFirst({
      where: { user_id },
    });
    if (!company)
      return res.status(400).json({ message: "Utilisateur sans entreprise" });

    const { titre, description, type_contrat, localisation, salaire, statut } =
      req.body;

    const job = await prisma.jobs.create({
      data: {
        titre,
        description,
        type_contrat,
        localisation,
        salaire,
        statut,
        user_id,
        company_id: company.id,
      },
    });

    res.status(201).json({ job });
  } catch (err) {
    console.error("Erreur createJob :", err);
    res.status(500).json({ message: "Erreur lors de la création de l'offre" });
  }
};

// Mettre à jour une offre
exports.editJob = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id))
    return res.status(400).json({ message: "ID d'offre invalide" });

  const { titre, description, type_contrat, localisation, salaire, statut } =
    req.body;

  try {
    const job = await prisma.jobs.update({
      where: { id },
      data: { titre, description, type_contrat, localisation, salaire, statut },
    });
    res.json({ job });
  } catch (err) {
    console.error("Erreur editJob :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de l'offre" });
  }
};

// Supprimer une offre
exports.deleteJob = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id))
    return res.status(400).json({ message: "ID d'offre invalide" });

  try {
    await prisma.jobs.delete({ where: { id } });
    res.json({ message: "Offre supprimée" });
  } catch (err) {
    console.error("Erreur deleteJob :", err);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'offre" });
  }
};

// Récupérer les offres d'un recruteur
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await prisma.jobs.findMany({
      where: { user_id: req.user.id },
      include: { companies: true },
      orderBy: { posted_at: "desc" },
    });
    res.json({ jobs });
  } catch (err) {
    console.error("Erreur getMyJobs :", err);
    res.status(500).json({ message: "Erreur lors du chargement des offres" });
  }
};
