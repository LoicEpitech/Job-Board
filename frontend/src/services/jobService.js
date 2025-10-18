// src/services/jobService.js
import axios from "axios";

const API_URL = "/api/jobs";

//  Récupérer toutes les offres
export const getAllJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.jobs || [];
  } catch (error) {
    console.error("Erreur dans getAllJobs :", error);
    throw error;
  }
};

//  Récupérer une offre par ID
export const getJobById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.job;
  } catch (error) {
    console.error("Erreur dans getJobById :", error);
    throw error;
  }
};

//  Publier une nouvelle offre
export const createJob = async (jobData, token) => {
  try {
    const response = await axios.post(`${API_URL}/create`, jobData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans createJob :", error);
    throw error;
  }
};

//  Candidater à une offre
export const applyToJob = async (id, motivation, token) => {
  try {
    const response = await axios.post(
      `/api/applications/apply/${id}`,
      { motivation },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Erreur dans applyToJob :", error);

    // Crée un objet d'erreur standard pour le frontend
    const err = new Error(
      error.response?.data?.message || "Erreur lors de la candidature"
    );
    err.status = error.response?.status || 500;
    err.redirect = error.response?.data?.redirect || null;

    throw err;
  }
};

//  Récupérer mes offres
export async function getMyJobs(token) {
  const res = await fetch("/api/jobs/my-jobs", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des offres");
  return res.json();
}

//  Récupérer les candidatures pour une offre
export async function getApplicationsForJob(jobId, token) {
  const res = await fetch(`/api/applications/by-job/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des candidatures");
  return res.json();
}

//  Mettre à jour le statut d'une candidature
export async function updateApplicationStatus(appId, statut, token) {
  const res = await fetch(`/api/applications/${appId}/statut`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ statut }),
  });
  if (!res.ok) throw new Error("Erreur lors de la mise à jour du statut");
  return res.json();
}

//  Clore une offre
export async function closeJob(jobId, token) {
  const res = await fetch(`/api/jobs/delete/${jobId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors de la suppression de l'offre");
  return res.json();
}
