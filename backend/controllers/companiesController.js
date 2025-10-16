const Company = require("../models/companies");

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.getCompanies();
    res.json({ companies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getCompanyById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ message: "ID d'entreprise invalide" });
  }
  try {
    const company = await Company.getCompanyById(id);
    if (!company) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }
    res.json(company);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.createCompany = async (req, res) => {
  const {
    nom,
    description,
    secteur_activite,
    site_web,
    pays,
    ville,
    code_postal,
    user_id,
    mail,
  } = req.body;
  try {
    const newCompany = await Company.createCompany({
      nom,
      description,
      secteur_activite,
      site_web,
      pays,
      ville,
      code_postal,
      user_id,
      mail,
    });
    res
      .status(201)
      .json({ message: "Entreprise créée avec succès", company: newCompany });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.updateCompany = async (req, res) => {
  const { id } = req.params;
  const {
    nom,
    description,
    secteur_activite,
    site_web,
    pays,
    ville,
    code_postal,
    mail,
  } = req.body;
  try {
    const updatedCompany = await Company.updateCompany(id, {
      nom,
      description,
      secteur_activite,
      site_web,
      pays,
      ville,
      code_postal,
      mail,
    });
    if (!updatedCompany) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }
    res.json({
      message: "Entreprise mise à jour avec succès",
      company: updatedCompany,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.deleteCompany = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Company.deleteCompany(id);
    if (!deleted) {
      return res.status(404).json({ message: "Entreprise non trouvée" });
    }
    res.json({ message: "Entreprise supprimée avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.searchCompanies = async (req, res) => {
  const { query } = req.query;
  try {
    const companies = await Company.searchCompanies(query);
    res.json({ companies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
