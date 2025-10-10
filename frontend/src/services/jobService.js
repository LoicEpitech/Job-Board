// src/services/jobService.js
import axios from "axios";

const API_URL = "/api/jobs";

// ✅ Récupérer toutes les offres
export const getAllJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data.jobs || [];
  } catch (error) {
    console.error("Erreur dans getAllJobs :", error);
    throw error;
  }
};

// ✅ Récupérer une offre par ID
export const getJobById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data.job;
  } catch (error) {
    console.error("Erreur dans getJobById :", error);
    throw error;
  }
};

// ✅ Publier une nouvelle offre
export const postJob = async (jobData, token) => {
  try {
    const response = await axios.post(`${API_URL}/postJob`, jobData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Erreur dans postJob :", error);
    throw error;
  }
};

// ✅ Candidater à une offre
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
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

export async function getMyJobs(token) {
  const res = await fetch("/api/jobs/my-jobs", {
    //faire un console log du token
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des offres");
  return res.json();
}

export async function getApplicationsForJob(jobId, token) {
  const res = await fetch(`/api/applications/by-job/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Erreur lors du chargement des candidatures");
  return res.json(); // ✅ retourne directement le tableau
}

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
