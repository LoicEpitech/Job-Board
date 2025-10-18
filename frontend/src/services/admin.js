// src/services/admin.js
import { useApi } from "./api";

export function useAdminService() {
  const apiFetch = useApi();

  //  Lecture des données d'une table
  const getData = async (table) => {
    const token = localStorage.getItem("token");

    const res = await apiFetch(`/api/${table}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : data[table] || [];
  };

  //  Sauvegarde (création ou édition)
  const saveData = async (table, row) => {
    const token = localStorage.getItem("token");
    const url = row.id
      ? `/api/${table}/edit/${row.id}`
      : `/api/${table}/create`;

    const res = await apiFetch(url, {
      method: row.id ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(row),
    });

    if (!res) return null;
    return await res.json();
  };

  //  Suppression
  const deleteData = async (table, id) => {
    const token = localStorage.getItem("token");

    const res = await apiFetch(`/api/${table}/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res) return null;
    return await res.json();
  };

  return { getData, saveData, deleteData };
}
