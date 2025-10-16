const Job = require("../models/Job");

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.getAll();
    res.json({ jobs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getJobById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID d'offre invalide" });
  }
  try {
    const job = await Job.getById(id);
    if (job) {
      res.json({ job });
    } else {
      res.status(404).json({ message: "Offre non trouvée" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.postJob = async (req, res) => {
  const user_id = req.user.id;
  const company_id = await Job.getCompanyIdByUserId(user_id);

  const { titre, description, type_contrat, localisation, salaire } = req.body;
  try {
    const job = await Job.create({
      titre,
      description,
      type_contrat,
      localisation,
      salaire,
      company_id,
      user_id,
    });
    res.status(201).json({ job });
  } catch (err) {
    console.error("Erreur postJob :", err);
    res.status(500).json({ message: "Erreur lors de la création de l'offre" });
  }
};

exports.editJob = async (req, res) => {
  const { titre, description, lieu, salaire, type_contrat } = req.body;
  try {
    const job = await Job.update(req.params.id, {
      titre,
      description,
      lieu,
      salaire,
      type_contrat,
    });
    if (job) {
      res.json({ job });
    } else {
      res.status(404).json({ message: "Offre non trouvée" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de l'offre" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.delete(req.params.id);
    if (job) {
      res.json({ message: "Offre supprimée", job });
    } else {
      res.status(404).json({ message: "Offre non trouvée" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'offre" });
  }
};

exports.getMyJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await Job.getByUserId(userId);
    res.json(jobs);
  } catch (err) {
    console.error("Erreur dans getMyJobs :", err);
    res.status(500).json({ message: "Erreur lors du chargement des offres" });
  }
};

exports.createJob = async (req, res) => {
  const {
    titre,
    description,
    type_contrat,
    localisation,
    salaire,
    statut,
    company_id,
    user_id,
  } = req.body;
  try {
    const job = await Job.create({
      titre,
      description,
      type_contrat,
      localisation,
      salaire,
      statut,
      company_id,
      user_id,
    });
    res.status(201).json({ job });
  } catch (err) {
    console.error("Erreur dans createJob :", err);
    res.status(500).json({ message: "Erreur lors de la création de l'offre" });
  }
};

exports.editJob = async (req, res) => {
  const {
    titre,
    description,
    type_contrat,
    localisation,
    salaire,
    statut,
    company_id,
    user_id,
  } = req.body;
  try {
    const job = await Job.update(req.params.id, {
      titre,
      description,
      type_contrat,
      localisation,
      salaire,
      statut,
      company_id,
      user_id,
    });
    if (job) {
      res.json({ job });
    } else {
      res.status(404).json({ message: "Offre non trouvée" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de l'offre" });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.delete(req.params.id);
    if (job) {
      res.json({ message: "Offre supprimée", job });
    } else {
      res.status(404).json({ message: "Offre non trouvée" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'offre" });
  }
};
