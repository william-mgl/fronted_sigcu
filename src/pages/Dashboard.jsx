import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaWallet, FaSignOutAlt, FaUserCircle, FaUniversity, 
  FaUtensils, FaHistory, FaReceipt, FaClock, FaSearch 
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [facultades, setFacultades] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Cargar usuario inicial y verificar sesión
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  // 2. Obtener datos (Facultades, Historial, Saldo)
  useEffect(() => {
    if (!user || !user.id) return;

    const token = localStorage.getItem("token");
    const authHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` 
    };

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // A) Cargar Facultades
        const resFac = await fetch(`${API_URL}/api/facultades`, { headers: authHeaders });
        if (resFac.ok) {
          const dataFac = await resFac.json();
          setFacultades(dataFac);
        }

        // B) Cargar Historial (Ruta corregida en backend: /api/reservas/usuario/:id)
        const resHist = await fetch(`${API_URL}/api/reservas/usuario/${user.id}`, { headers: authHeaders });
        if (resHist.ok) {
          const dataHist = await resHist.json();
          setHistorial(Array.isArray(dataHist) ? dataHist : []);
        }

        // C) Obtener Saldo actualizado y actualizar LocalStorage
        const resUser = await fetch(`${API_URL}/api/usuarios/${user.id}`, { headers: authHeaders });
        if (resUser.ok) {
          const dataUser = await resUser.json();
          setSaldo(Number(dataUser.saldo) || 0);
          
          // Actualizamos el usuario en localstorage para que Comedor.jsx también lo vea
          const updatedUser = { ...user, saldo: dataUser.saldo };
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else if (resUser.status === 403) {
          // Si hay error de permisos, probablemente el token expiró
          handleLogout();
        }
        
      } catch (err) {
        console.error("Error cargando dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]); // Solo se dispara cuando el ID del usuario está listo

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return null; // Evita parpadeos mientras redirige

  return (
    <div className="d-flex flex-column min-vh-100 text-white"
         style={{ 
             background: "linear-gradient(135deg, #000428, #004e92)", 
             overflowY: "auto",
             position: "relative"
         }}>
      
      {/* FONDO AMBIENTAL */}
      <div style={{ position: "absolute", top: "-10%", right: "-10%", width: "500px", height: "500px", background: "rgba(0, 255, 255, 0.05)", borderRadius: "50%", filter: "blur(100px)", zIndex: 0 }}></div>

      {/* NAVBAR GLASSMORPHISM */}
      <nav className="navbar navbar-expand-lg px-4 py-3 shadow-sm sticky-top" 
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(15px)", zIndex: 100, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="container-fluid">
            <div className="d-flex align-items-center gap-3">
                <div className="position-relative">
                  <FaUserCircle size={45} className="text-info" />
                  <span className="position-absolute bottom-0 end-0 bg-success border border-dark rounded-circle" style={{ width: '12px', height: '12px' }}></span>
                </div>
                <div>
                    <h5 className="m-0 fw-bold text-white text-capitalize">Hola, {user.nombre.split(' ')[0]}</h5>
                    <small className="text-info opacity-75 fw-bold" style={{fontSize: '0.75rem', letterSpacing: '1px'}}>
                      {user.rol === 'estudiante' ? 'ESTUDIANTE UTM' : 'ADMINISTRADOR'}
                    </small>
                </div>
            </div>

            <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center gap-2 px-3 py-2 rounded-pill shadow-lg border border-white border-opacity-10"
                     style={{ background: "rgba(255,255,255,0.1)" }}>
                    <FaWallet className="text-success" size={18} />
                    <span className="fw-bold fs-5">${Number(saldo).toFixed(2)}</span>
                </div>
                <button
                    className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3 rounded-pill transition-all"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt /> <span className="d-none d-md-inline">Salir</span>
                </button>
            </div>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="container py-5" style={{ zIndex: 1 }}>
        <div className="row g-4">
          
          {/* PANEL IZQUIERDO: FACULTADES */}
          <div className="col-lg-7 col-md-12 animate__animated animate__fadeInLeft">
              <div className="card border-0 shadow-lg h-100"
                   style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(15px)", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  
                  <div className="card-header border-0 bg-transparent p-4 pb-2">
                      <h4 className="fw-bold text-white d-flex align-items-center gap-2">
                          <FaUniversity className="text-warning" /> Facultades
                      </h4>
                      <p className="text-white-50">Selecciona tu facultad para ver comedores disponibles</p>
                  </div>

                  <div className="card-body p-4 pt-0">
                      <div className="row g-3">
                          {facultades.length > 0 ? facultades.map(f => (
                              <div key={f.id} className="col-12">
                                <button
                                    className="btn w-100 d-flex align-items-center justify-content-between p-3 rounded-4 border-0 text-white text-start transition-all"
                                    onClick={() => navigate(`/comedores/${f.id}`)}
                                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.05)" }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-info bg-opacity-25 p-3 rounded-circle text-info">
                                            <FaUtensils />
                                        </div>
                                        <div>
                                          <span className="fw-bold d-block">{f.nombre}</span>
                                          <small className="text-white-50">Ver menús del día</small>
                                        </div>
                                    </div>
                                    <FaSearch className="text-info opacity-50" />
                                </button>
                              </div>
                          )) : (
                            <div className="text-center py-5 opacity-50">
                              <div className="spinner-border spinner-border-sm text-info mb-2"></div>
                              <p>Buscando facultades...</p>
                            </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>

          {/* PANEL DERECHO: HISTORIAL */}
          <div className="col-lg-5 col-md-12 animate__animated animate__fadeInRight">
              <div className="card border-0 shadow-lg h-100"
                   style={{ background: "rgba(0, 0, 0, 0.2)", backdropFilter: "blur(15px)", borderRadius: "25px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  
                  <div className="card-header border-0 bg-transparent p-4 pb-2">
                      <h4 className="fw-bold text-white d-flex align-items-center gap-2">
                          <FaHistory className="text-info" /> Mi Actividad
                      </h4>
                      <p className="text-white-50">Tus últimas 5 reservas</p>
                  </div>

                  <div className="card-body p-3 overflow-auto" style={{ maxHeight: "450px" }}>
                      {historial.length === 0 ? (
                          <div className="text-center py-5 opacity-25">
                              <FaReceipt size={50} className="mb-3" />
                              <p>Aún no has realizado pedidos</p>
                          </div>
                      ) : (
                          <div className="d-flex flex-column gap-3">
                              {historial.slice(0, 5).map(r => (
                                  <div key={r.id} className="d-flex align-items-center justify-content-between p-3 rounded-4"
                                       style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
                                      
                                      <div className="d-flex align-items-center gap-3">
                                          <div className={`p-2 rounded-3 ${r.estado === 'retirado' ? 'bg-success bg-opacity-25 text-success' : 'bg-warning bg-opacity-25 text-warning'}`}>
                                            <FaUtensils size={14} />
                                          </div>
                                          <div>
                                              <h6 className="m-0 fw-bold text-white" style={{fontSize: '0.85rem'}}>{r.plato_nombre || "Menú Universitario"}</h6>
                                              <small className="text-white-50 d-flex align-items-center gap-1" style={{fontSize: '0.75rem'}}>
                                                  <FaClock size={10} /> {new Date(r.fecha_reserva).toLocaleDateString()}
                                              </small>
                                          </div>
                                      </div>

                                      <div className="text-end">
                                          <span className="d-block fw-bold text-white" style={{fontSize: '0.9rem'}}>${Number(r.precio_total || 0).toFixed(2)}</span>
                                          <span className={`badge rounded-pill ${r.estado === 'pendiente' ? 'bg-warning text-dark' : 'bg-success'}`} style={{fontSize: '0.65rem', letterSpacing: '0.5px'}}>
                                              {r.estado.toUpperCase()}
                                          </span>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              </div>
          </div>

        </div>
      </main>
      
      <footer className="mt-auto p-4 text-center text-white-50 w-100" style={{ fontSize: "0.8rem", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        © 2026 Universidad Técnica de Manabí • Sistema de Gestión de Comedores
      </footer>
    </div>
  );
}