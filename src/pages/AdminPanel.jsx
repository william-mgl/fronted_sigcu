import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserShield, FaMoneyBillWave, FaSignOutAlt, FaUsers, FaCoins, FaArrowLeft } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminPanel() {
  const navigate = useNavigate(); 
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); 
  const user = JSON.parse(localStorage.getItem("user"));

  // Función para obtener usuarios (la sacamos para poder re-usarla)
  const obtenerUsuarios = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/api/usuarios`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        // Filtrar solo estudiantes para la recarga (opcional)
        setUsuarios(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error cargando usuarios:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token || user?.rol !== 'admin') {
      navigate('/login');
      return;
    }
    obtenerUsuarios();
  }, [token, user, navigate, obtenerUsuarios]);

  const recargar = async (e) => {
    e.preventDefault();
    if (!userId || !monto) return;

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

      const data = await res.json();

      if (res.ok) {
        setMensaje({ type: "success", text: `✅ Saldo de ${data.usuario || 'estudiante'} actualizado` });
        setMonto(""); 
        setUserId("");
        await obtenerUsuarios(); // Refrescar lista con saldos nuevos
      } else {
        setMensaje({ type: "error", text: data.error || "Error en la recarga" });
      }
    } catch (error) {
      setMensaje({ type: "error", text: "Error de conexión con el servidor" });
    } finally {
      setLoading(false);
      setTimeout(() => setMensaje(null), 4000);
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 text-white" 
         style={{ background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" }}>
      
      {/* NAVBAR ADMIN */}
      <nav className="navbar navbar-dark bg-dark bg-opacity-50 px-4 shadow-lg sticky-top" style={{ backdropFilter: "blur(10px)" }}>
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <FaUserShield className="text-warning" size={28} /> 
            <h4 className="m-0 fw-bold">SIGCU <span className="text-warning">ADMIN</span></h4>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-outline-light btn-sm rounded-pill" onClick={() => navigate('/dashboard')}>
              <FaArrowLeft /> Dashboard
            </button>
            <button className="btn btn-danger btn-sm rounded-pill" onClick={() => { localStorage.clear(); navigate('/login'); }}>
              <FaSignOutAlt /> Salir
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card text-white shadow-lg border-0 animate__animated animate__fadeInUp" 
                 style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.1)" }}>
              
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="bg-success bg-opacity-25 d-inline-block p-3 rounded-circle mb-3">
                    <FaMoneyBillWave size={40} className="text-success" />
                  </div>
                  <h3 className="fw-bold">Gestión de Saldo</h3>
                  <p className="text-white-50">Recarga crédito a las cuentas de los estudiantes</p>
                </div>
                
                {mensaje && (
                  <div className={`alert ${mensaje.type === 'error' ? 'alert-danger bg-danger' : 'alert-success bg-success'} bg-opacity-25 border-0 text-white text-center animate__animated animate__shakeX`}>
                    {mensaje.text}
                  </div>
                )}

                <form onSubmit={recargar}>
                  <div className="mb-3">
                    <label className="form-label small text-info fw-bold"><FaUsers /> SELECCIONAR ESTUDIANTE</label>
                    <select 
                      className="form-select bg-dark text-white border-secondary p-3" 
                      style={{ borderRadius: "12px" }}
                      value={userId} 
                      onChange={e => setUserId(e.target.value)} 
                      required
                    >
                      <option value="">{loading ? "Cargando..." : "-- Buscar por nombre --"}</option>
                      {usuarios.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.nombre} - [Saldo actual: ${Number(u.saldo).toFixed(2)}]
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small text-info fw-bold"><FaCoins /> MONTO A RECARGAR ($)</label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-success fw-bold">$</span>
                      <input 
                        type="number" 
                        className="form-control bg-dark text-white border-secondary p-3" 
                        placeholder="0.00" 
                        value={monto} 
                        onChange={e => setMonto(e.target.value)} 
                        step="0.01" 
                        min="0.01"
                        required 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-success w-100 fw-bold py-3 shadow-sm rounded-pill"
                    disabled={loading || !userId || !monto}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : "CONFIRMAR RECARGA"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-4 text-center text-white-50">
        <small>© 2026 UTM - Sistema de Gestión Administrativa</small>
      </footer>
    </div>
  );
}