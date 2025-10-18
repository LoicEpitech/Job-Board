import React, { useState, useEffect } from "react";
import { useAdminService } from "../services/admin";
import "./modules/Admin.css";

function Admin() {
  const { getData, saveData, deleteData } = useAdminService();
  const [selectedTable, setSelectedTable] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const tables = [
    { key: "users", label: "Utilisateurs", searchField: "nom" },
    { key: "companies", label: "Entreprises", searchField: "nom" },
    { key: "jobs", label: "Offres d'emploi", searchField: "titre" },
  ];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await getData(selectedTable);
      setData(result);
      setLoading(false);
    };
    loadData();
  }, [selectedTable]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    const result = await saveData(selectedTable, editRow);

    if (result && result.message) {
      setMessage(result.message);
      setMessageType("success");
      const updatedRow =
        result[selectedTable.slice(0, -1)] ||
        result[selectedTable] ||
        result.user ||
        result.company ||
        result.job ||
        {};
      if (updatedRow.id) {
        setData((prev) =>
          editRow.id
            ? prev.map((row) =>
                row.id === updatedRow.id ? { ...row, ...updatedRow } : row
              )
            : [...prev, updatedRow]
        );
      }
      setEditRow(null);
    } else {
      setMessage(result?.message || "Erreur");
      setMessageType("error");
    }

    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async (row) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ?")) return;
    setLoading(true);
    const result = await deleteData(selectedTable, row.id || row._id);
    if (result && result.message) {
      setData((prev) =>
        prev.filter((r) => (r.id || r._id) !== (row.id || row._id))
      );
      setMessage(result.message);
      setMessageType("success");
    } else {
      setMessage("Erreur suppression");
      setMessageType("error");
    }
    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const searchField = tables.find((t) => t.key === selectedTable)?.searchField;
  const filteredData = data.filter((row) =>
    search
      ? String(row[searchField] || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      : true
  );

  // helper pour afficher/parse les dates pour input[type="date"]
  const formatDateForInput = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (isNaN(d)) return "";
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const isDateField = (col) => /(_at$|date)/i.test(col);

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin - Gestion des données</h1>

      {/* Choix de table */}
      <div className="admin-table-select">
        {tables.map((table) => (
          <button
            key={table.key}
            onClick={() => {
              setSelectedTable(table.key);
              setSearch("");
            }}
            className={`admin-table-btn${
              selectedTable === table.key ? " selected" : ""
            }`}
          >
            {table.label}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`admin-message ${messageType}`}
          style={{
            backgroundColor: messageType === "success" ? "#f0fdf4" : "#fef2f2",
            color: messageType === "success" ? "#15803d" : "#b91c1c",
            border: `2px solid ${
              messageType === "success" ? "#86efac" : "#fca5a5"
            }`,
            padding: "0.5rem",
            marginBottom: "1rem",
            borderRadius: "0.5rem",
          }}
        >
          {message}
        </div>
      )}

      <input
        type="text"
        className="admin-search-input"
        placeholder={
          selectedTable === "jobs"
            ? "Rechercher par titre..."
            : "Rechercher par nom..."
        }
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="admin-loading">Chargement...</p>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Actions</th>
                {filteredData[0] &&
                  Object.keys(filteredData[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id || row._id}>
                  <td>
                    <button onClick={() => setEditRow(row)}>Modifier</button>
                    <button onClick={() => handleDelete(row)}>Supprimer</button>
                  </td>
                  {Object.keys(row).map((col) => (
                    <td key={col}>{String(row[col])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={() => setEditRow({})}>Créer</button>

          {editRow && (
            <form onSubmit={handleSave}>
              {Object.keys(filteredData[0] || {})
                .filter(
                  (col) =>
                    ![
                      "id",
                      "_id",
                      "created_at",
                      "updated_at",
                      "posted_at",
                    ].includes(col)
                )
                .map((col) => {
                  const dateField = isDateField(col);
                  return (
                    <div key={col}>
                      <label>{col}</label>
                      <input
                        type={dateField ? "date" : "text"}
                        value={
                          dateField
                            ? formatDateForInput(editRow[col])
                            : editRow[col] || ""
                        }
                        onChange={(e) =>
                          setEditRow({
                            ...editRow,
                            [col]: e.target.value,
                          })
                        }
                      />
                    </div>
                  );
                })}
              <button type="submit">Enregistrer</button>
              <button type="button" onClick={() => setEditRow(null)}>
                Annuler
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}

export default Admin;
