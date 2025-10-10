import React, { useState, useEffect } from "react";

function Admin() {
  const [selectedTable, setSelectedTable] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const tables = [
    { key: "users", label: "Utilisateurs" },
    { key: "companies", label: "Entreprises" },
    { key: "jobs", label: "Offres d'emploi" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let url = `/api/${selectedTable}`;
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        setData(Array.isArray(result) ? result : result[selectedTable] || []);
      } catch (err) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedTable]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin - Gestion des données</h1>
      <div style={{ marginBottom: "2rem" }}>
        {tables.map((table) => (
          <button
            key={table.key}
            onClick={() => setSelectedTable(table.key)}
            style={{
              marginRight: "1rem",
              padding: "0.5rem 1rem",
              background: selectedTable === table.key ? "#2563eb" : "#e5e7eb",
              color: selectedTable === table.key ? "#fff" : "#222",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {table.label}
          </button>
        ))}
      </div>
      <h2>{tables.find((t) => t.key === selectedTable)?.label}</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {data[0] &&
                Object.keys(data[0]).map((col) => (
                  <th
                    key={col}
                    style={{
                      borderBottom: "2px solid #e5e7eb",
                      padding: "0.5rem",
                      textAlign: "left",
                      background: "#f3f4f6",
                    }}
                  >
                    {col}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id || row._id}>
                {Object.keys(row).map((col) => (
                  <td
                    key={col}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      padding: "0.5rem",
                    }}
                  >
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  style={{ textAlign: "center", padding: "2rem" }}
                >
                  Aucune donnée à afficher.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Admin;
