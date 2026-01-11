import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { FaUserShield, FaMoneyBillWave, FaSignOutAlt, FaUsers, FaCoins } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

function AdminPanel() {
  const navigate = useNavigate(); 
  const [usuarios, setUsuarios] = useState([]);
  const [userId, setUserId] = useState("");
  const [monto, setMonto] = useState("");
  const [mensaje, setMensaje] = useState(null);

  const token = localStorage.getItem("token"); 
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Cargar lista de usuarios (Solo estudiantes para recarga)
  const obtenerUsuarios = () => {
    fetch(`${API_URL}/api/usuarios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      }
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        // Filtramos para mostrar solo estudiantes si es necesario
        setUsuarios(Array.isArray(data) ? data : []);
      })
      .catch(err => console.error("Error cargando usuarios:", err));
  };

  useEffect(() => {
    // Verificación de Seguridad: Token y Rol
    if (!token || !user || user.rol !== 'admin') {
        navigate('/login');
        return;
    }
    obtenerUsuarios(); 
  }, [token, navigate]);

  // 2. Función de Recarga
  const recargar = async (e) => {
    e.preventDefault();
    if (!userId || !monto) {
      setMensaje({ type: "error", text: "⚠️ Selecciona un usuario y un monto válido." });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/usuarios/saldo`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ 
            id: userId, 
            monto: Number(monto) // Aseguramos que sea número
        }) 
      });

      const data = await res.json();
      
      if (res.ok) {
        setMensaje({ type: "success", text: `✅ Recarga exitosa: ${data.message || 'Saldo actualizado'}` });
        setMonto(""); 
        setUserId(""); // Resetear selector
        obtenerUsuarios(); // Refrescar lista con nuevos saldos
        
        setTimeout(() => setMensaje(null), 3500);
      } else {
        setMensaje({ type: "error", text: `❌ ${data.error || "No se pudo procesar"}` });
      }
      
    } catch (error) {
      setMensaje({ type: "error", text: "❌ Error de conexión" });
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 text-white"
         style={{ background: "linear-gradient(135deg, #141E30, #243B55)" }}>

      {/* NAVBAR */}
      <nav className="navbar navbar-dark bg-dark bg-opacity-50 px-4 shadow-sm" style={{ backdropFilter: "blur(10px)" }}>
        <div className="d-flex align-items-center gap-3">
            <FaUserShield size={28} className="text-warning" />
            <h4 className="m-0 fw-bold">Administración de Fondos</h4>
        </div>
        <button 
            className="btn btn-sm btn-outline-danger rounded-pill px-3 d-flex align-items-center gap-2"
            onClick={() => { localStorage.clear(); navigate('/login'); }}
        >
            <FaSignOutAlt /> Cerrar Sesión
        </button>
      </nav>

      {/* CONTENIDO */}
      <div className="container d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5">
        
        

        <div className="card shadow-lg p-4 border-0 animate__animated animate__fadeIn" 
             style={{ 
                 maxWidth: "550px", 
                 width: "100%", 
                 background: "rgba(255, 255, 255, 0.05)", 
                 backdropFilter: "blur(15px)",
                 borderRadius: "25px",
                 border: "1px solid rgba(255,255,255,0.1)"
             }}>
          
          <div className="text-center mb-4">
            <div className="bg-success bg-opacity-25 rounded-circle d-inline-flex p-4 mb-3">
                <FaMoneyBillWave size={50} className="text-success" />
            </div>
            <h2 className="fw-bold text-white">Bóveda Virtual</h2>
            <p className="text-white-50">Ingresa el ID del estudiante y el monto a asignar</p>
          </div>

          {mensaje && (
              <div className={`alert ${mensaje.type === 'error' ? 'alert-danger' : 'alert-success'} border-0 shadow-sm text-center py-2`}>
                  {mensaje.text}
              </div>
          )}

          <form onSubmit={recargar}>
            <div className="mb-3">
                <label className="form-label text-white-50 small d-flex align-items-center gap-2">
                    <FaUsers /> LISTA DE ESTUDIANTES:
                </label>
                <select
                    className="form-select form-select-lg bg-dark text-white border-0 shadow-none"
                    style={{ borderRadius: "12px" }}
                    onChange={e => setUserId(e.target.value)}
                    value={userId}
                >
                    <option value="">-- Seleccionar usuario --</option>
                    {usuarios.map(u => (
                        <option key={u.id} value={u.id}>
                            {u.nombre} (ID: {u.id}) - Actual: ${Number(u.saldo).toFixed(2)}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="form-label text-white-50 small d-flex align-items-center gap-2">
                    <FaCoins /> MONTO A DEPOSITAR:
                </label>
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-dark border-0 text-success fw-bold">$</span>
                    <input
                        type="number"
                        className="form-control bg-dark text-white border-0 shadow-none"
                        placeholder="0.00"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        min="0.01"
                        step="0.01"
                        style={{ borderRadius: "0 12px 12px 0" }}
                    />
                </div>
            </div>

            <button 
                type="submit" 
                className="btn btn-success w-100 btn-lg fw-bold rounded-pill py-3 shadow transition-all"
                disabled={!userId || !monto}
                style={{ letterSpacing: "1px" }}
            >
                EJECUTAR RECARGA
            </button>
          </form>
        </div>
        
        <footer className="mt-5 text-center text-white-50 small">
          © 2026 Universidad Técnica de Manabí <br /> 
          <span className="opacity-50">Módulo de Transacciones Centralizadas</span>
        </footer>
      </div>
    </div>
  );
}

export default AdminPanel;