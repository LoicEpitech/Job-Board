// controllers/applicationController.js
const Application = require("../models/Application");

exports.applyToJob = async (req, res) => {
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
      return res.status(400).json({
        message: "Vous avez déjà postulé à cette offre.",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Erreur lors de la candidature" });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.getMyApplications(req.user.id);
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des candidatures" });
  }
};

exports.getApplicationsForJob = async (req, res) => {
  try {
    const applications = await Application.getApplicationsForJob(req.params.id);
    res.json({ applications });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des candidatures" });
  }
};

exports.updateApplicationStatus = async (req, res) => {
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
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du statut" });
  }
};

// exports.deleteApplication = async (req, res) => {
//   try {
//     const deleted = await Application.delete(req.params.id, req.user.id);
//     if (!deleted)
//       return res.status(404).json({ message: "Candidature non trouvée" });
//     res.json({ message: "Candidature supprimée" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Erreur lors de la suppression" });
//   }
// };
