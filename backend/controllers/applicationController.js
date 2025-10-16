// controllers/applicationController.js
import Application from "../models/Application.js";

// POST /api/applications/:id/apply
export const applyToJob = async (req, res) => {
  const user_id = req.user.id;
  const job_id = req.params.id;
  const lettre_motivation = req.body.motivation;

  try {
    const application = await Application.applyToJob({
      user_id,
      job_id,
      lettre_motivation,
    });
    res.status(201).json({ application });
  } catch (err) {
    if (err.message === "NO_CV") {
      return res.status(400).json({
        message: "Vous devez ajouter un CV avant de postuler.",
        redirect: "/profile",
      });
    }
    if (err.message === "ALREADY_APPLIED") {
      return res.status(401).json({
        message: "Vous avez déjà postulé à cette offre.",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Erreur lors de la candidature" });
  }
};

// GET /api/applications/mine
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.getMyApplications(req.user.id);
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des candidatures",
    });
  }
};

// GET /api/applications/job/:id
export const getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.getApplicationsForJob(req.params.id);
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la récupération des candidatures",
    });
  }
};

// PATCH /api/applications/:id/status
export const updateApplicationStatus = async (req, res) => {
  const appId = req.params.id;
  const { statut } = req.body;
  try {
    const updated = await Application.updateStatus(appId, statut);
    if (!updated) {
      return res.status(404).json({ message: "Candidature non trouvée" });
    }
    res.json({ message: "Statut de la candidature mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Erreur lors de la mise à jour du statut",
    });
  }
};
