import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserShield, FaMoneyBillWave, FaSignOutAlt, FaUsers, FaCoins, FaArrowLeft } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const navigate = useNavigate(); 
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); 
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const obtenerUsuarios = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setUsuarios(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // PROTECCIÓN: Validamos contra 'admin_comedor'
    if (!token || user?.rol !== 'admin_comedor') {
      navigate('/login');
      return;
    }
    obtenerUsuarios();
  }, [token, user, navigate, obtenerUsuarios]);

  const recargar = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/usuarios/saldo`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ id: userId, monto: Number(monto) }) 
      });

      if (res.ok) {
        setMensaje({ type: "success", text: "✅ Recarga exitosa" });
        setMonto(""); 
        setUserId("");
        obtenerUsuarios();
      } else {
        setMensaje({ type: "error", text: "Error en la recarga" });
      }
    } catch (error) {
      setMensaje({ type: "error", text: "Error de servidor" });
    } finally {
      setLoading(false);
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  return (
    <div className="min-vh-100 text-white" style={{ background: "linear-gradient(135deg, #0f2027, #2c5364)" }}>
      <nav className="navbar navbar-dark bg-dark px-4 shadow-lg">
        <div className="d-flex align-items-center gap-2">
          <FaUserShield className="text-warning" size={24} />
          <h5 className="m-0 fw-bold">ADMIN PANAL - SIGCU</h5>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-light btn-sm rounded-pill" onClick={() => navigate('/dashboard')}>
            <FaArrowLeft /> Dashboard
          </button>
          <button className="btn btn-danger btn-sm rounded-pill" onClick={() => { localStorage.clear(); navigate('/login'); }}>
            <FaSignOutAlt />
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card text-white p-4 shadow-lg border-0" 
                 style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", borderRadius: "20px" }}>
              <h4 className="text-center mb-4"><FaMoneyBillWave className="text-success" /> Recargar Saldo Estudiante</h4>
              
              {mensaje && <div className={`alert ${mensaje.type === 'error' ? 'alert-danger' : 'alert-success'} text-center`}>{mensaje.text}</div>}

              <form onSubmit={recargar}>
                <div className="mb-3">
                  <label className="small text-white-50"><FaUsers /> Seleccionar Usuario:</label>
                  <select className="form-select bg-dark text-white border-secondary" value={userId} onChange={e => setUserId(e.target.value)} required>
                    <option value="">-- Buscar en lista --</option>
                    {usuarios.map(u => (
                      <option key={u.id} value={u.id}>{u.nombre} (Saldo: ${Number(u.saldo).toFixed(2)})</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="small text-white-50"><FaCoins /> Monto a cargar ($):</label>
                  <input type="number" className="form-control bg-dark text-white border-secondary" placeholder="0.00" value={monto} onChange={e => setMonto(e.target.value)} step="0.01" required />
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold py-2 shadow" disabled={loading}>
                  {loading ? "Procesando..." : "EJECUTAR RECARGA"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}