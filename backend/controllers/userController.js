const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/cv/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

exports.uploadCV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier reçu" });
    }

    const fichier = `/uploads/cv/${req.file.filename}`;
    const titre = req.body.titre || req.file.originalname;

    // Ajoute le CV en BDD et met à jour profile_cv_id
    const updatedUser = await User.addCV(req.user.id, fichier, titre);

    res.json({ message: "CV ajouté avec succès", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Récupérer le profil
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Mettre à jour le profil
exports.updateProfile = async (req, res) => {
  try {
    const data = { ...req.body };
    // Met à jour le profil utilisateur
    const updatedUser = await User.updateProfile(req.user.id, data);

    // Met à jour le profil entreprise si besoin
    await User.updateCompanyProfile(req, updatedUser);

    res.json({ message: "Profil mis à jour", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Changer le mot de passe
exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6)
      return res.status(400).json({ message: "Mot de passe trop court" });

    await User.changePassword(req.user.id, password);
    res.json({ message: "Mot de passe mis à jour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Supprimer le compte
exports.deleteAccount = async (req, res) => {
  try {
    await User.deleteAccount(req.user.id);
    res.json({ message: "Compte supprimé avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Mettre à jour le type de profil
exports.updateUserType = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type || (type !== "candidat" && type !== "recruteur"))
      return res.status(400).json({ message: "Type de profil invalide" });

    const updatedUser = await User.updateUserType(req.user.id, type);
    res.json({ message: "Type de profil mis à jour", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.searchCompanies = async (req, res) => {
  try {
    const query = req.query.query;
    const companies = await User.searchCompanies(query);
    res.json({ companies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// Middleware pour gérer l'upload de CV
exports.uploadMiddleware = upload.single("cv");

//  Créer un utilisateur (admin)
exports.createUser = async (req, res) => {
  try {
    const {
      prenom,
      nom,
      email,
      date_naissance,
      pays,
      ville,
      code_postal,
      tel,
      mot_de_passe,
      type,
      profile_cv_id,
      entreprise_id,
    } = req.body;
    const password = mot_de_passe;
    if (!prenom || !nom || !email || !password || !type)
      return res.status(400).json({ message: "Champs requis manquants" });
    if (type !== "candidat" && type !== "recruteur" && type !== "admin")
      return res.status(400).json({ message: "Type de profil invalide" });

    const newUser = await User.createAdmin({
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
      profile_cv_id: profile_cv_id || null,
      entreprise_id: entreprise_id || null,
    });
    res.status(201).json({ message: "Utilisateur créé", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Mettre à jour un utilisateur (admin)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = { ...req.body };
    if (
      data.type &&
      data.type !== "candidat" &&
      data.type !== "recruteur" &&
      data.type !== "admin"
    )
      return res.status(400).json({ message: "Type de profil invalide" });

    const updatedUser = await User.update(userId, data);
    res.json({ message: "Utilisateur mis à jour", user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//  Supprimer un utilisateur (admin)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.delete(userId);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
