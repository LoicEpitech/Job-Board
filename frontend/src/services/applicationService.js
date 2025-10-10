// src/services/applicationService.js

const API_URL = "/api/applications";

/**
 * Récupère les candidatures de l'utilisateur connecté
 */
export async function getMyApplications(token) {
  try {
    const response = await fetch(`${API_URL}/my-applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des candidatures");
    }

    const data = await response.json();
    return data.applications || [];
  } catch (error) {
    console.error("Erreur dans getMyApplications:", error);
    throw error;
  }
}

/**
 * Soumet une nouvelle candidature à une offre d'emploi
 */
export async function applyToJob(jobId, token, motivation) {
  try {
    const response = await fetch(`${API_URL}/apply/${jobId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ motivation }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Gestion des cas spécifiques venant du backend
      if (data.message) throw new Error(data.message);
      throw new Error("Erreur lors de la candidature");
    }

    return data;
  } catch (error) {
    console.error("Erreur dans applyToJob:", error);
    throw error;
  }
}

/**
 * Supprime une candidature
 */
export async function deleteApplication(applicationId, token) {
  try {
    const response = await fetch(`${API_URL}/${applicationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Erreur lors de la suppression");
    }

    return data;
  } catch (error) {
    console.error("Erreur dans deleteApplication:", error);
    throw error;
  }
}
