import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserShield, FaMoneyBillWave, FaSignOutAlt, FaUsers, FaCoins } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminPanel() {
  const navigate = useNavigate(); 
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState(null);

  const token = localStorage.getItem("token"); 
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Protección de ruta: Si no es admin, fuera.
    if (!token || user?.rol !== 'admin') {
        navigate('/login');
        return;
    }

    const obtenerUsuarios = async () => {
        try {
            const res = await fetch(`${API_URL}/api/usuarios`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsuarios(data);
        } catch (err) { console.error(err); }
    };
    obtenerUsuarios();
  }, [token, navigate, user]);

  const recargar = async (e) => {
    e.preventDefault();
    if (!userId || !monto) return;

    try {
      const res = await fetch(`${API_URL}/api/usuarios/saldo`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ id: userId, monto: Number(monto) }) 
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje({ type: "success", text: `✅ Saldo actualizado correctamente` });
        setMonto(""); 
        setUserId("");
        // Refrescar lista
        const resRefresh = await fetch(`${API_URL}/api/usuarios`, { headers: { "Authorization": `Bearer ${token}` } });
        const dataRefresh = await resRefresh.json();
        setUsuarios(dataRefresh);
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({ type: "error", text: data.error || "Error en la recarga" });
      }
    } catch (error) { setMensaje({ type: "error", text: "Error de conexión" }); }
  };

  return (
    <div className="d-flex flex-column min-vh-100 text-white" style={{ background: "#141E30" }}>
      <nav className="navbar navbar-dark bg-dark px-4 shadow">
        <div className="d-flex align-items-center gap-2">
            <FaUserShield className="text-warning" /> <h4 className="m-0">Panel Admin</h4>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={() => { localStorage.clear(); navigate('/login'); }}>Salir</button>
      </nav>

      <div className="container py-5 d-flex justify-content-center">
        <div className="card bg-dark text-white p-4 shadow-lg border-secondary" style={{ maxWidth: "500px", width: "100%", borderRadius: "20px" }}>
          <h3 className="text-center mb-4"><FaMoneyBillWave className="text-success" /> Recarga de Saldo</h3>
          
          {mensaje && <div className={`alert ${mensaje.type === 'error' ? 'alert-danger' : 'alert-success'} text-center`}>{mensaje.text}</div>}

          <form onSubmit={recargar}>
            <div className="mb-3">
                <label className="small text-white-50"><FaUsers /> Seleccionar Usuario:</label>
                <select className="form-select bg-secondary text-white border-0" value={userId} onChange={e => setUserId(e.target.value)} required>
                    <option value="">-- Buscar estudiante --</option>
                    {usuarios.map(u => (
                        <option key={u.id} value={u.id}>{u.nombre} (Saldo: ${Number(u.saldo).toFixed(2)})</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="small text-white-50"><FaCoins /> Monto ($):</label>
                <input type="number" className="form-control bg-secondary text-white border-0" placeholder="0.00" value={monto} onChange={e => setMonto(e.target.value)} step="0.01" required />
            </div>
            <button type="submit" className="btn btn-success w-100 fw-bold py-2">PROCESAR PAGO</button>
          </form>
        </div>
      </div>
    </div>
  );
}