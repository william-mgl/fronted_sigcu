import { useEffect, useState } from "react";

function AdminPanel() {
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/admin/usuarios")
      .then(res => res.json())
      .then(data => setUsuarios(data));
  }, []);

  const recargar = async () => {
    if (!userId || !monto) {
      alert("Seleccione usuario y monto");
      return;
    }

    const res = await fetch("http://localhost:4000/api/admin/recargar", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, monto })
    });

    const data = await res.json();
    alert(data.message || data.error);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Panel de Administrador</h1>

      <h2>Usuarios registrados:</h2>
      <select
        onChange={e => setUserId(e.target.value)}
        style={{ width: "250px", padding: "5px" }}
      >
        <option value="">Seleccione un usuario</option>
        {usuarios.map(u => (
          <option key={u.id} value={u.id}>
            {u.nombre} — Saldo: ${u.saldo}
          </option>
        ))}
      </select>

      <br /><br />

      <input
        type="number"
        placeholder="Monto a recargar"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        style={{ padding: "5px", width: "150px" }}
      />

      <br /><br />

      <button onClick={recargar} style={{ padding: "10px 20px" }}>
        Recargar saldo
      </button>
    </div>
  );
}

export default AdminPanel;
