// src/services/api.js
export function useApi() {
  const apiFetch = async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });

      if (res.status === 401) {
        // Non connecté → redirige vers la page de login
        window.location.href = "/login";
        return null;
      }

      if (res.status === 403) {
        // Accès interdit → redirige vers la page forbidden
        window.location.href = "/forbidden";
        return null;
      }

      if (!res.ok) {
        // Autre erreur serveur
        const errMsg = await res.text();
        throw new Error(errMsg || "Erreur serveur");
      }

      return res;
    } catch (err) {
      console.error("Erreur API :", err);
      return null;
    }
  };

  return apiFetch;
}
