import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FaUtensils, FaArrowLeft, FaMapMarkerAlt, 
  FaClock, FaStoreSlash, FaDoorOpen 
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Comedores() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [comedores, setComedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si no hay ID de facultad, redirigir al dashboard para evitar errores
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const fetchComedores = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`${API_URL}/api/comedores/facultad/${id}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) {
          if (response.status === 403) throw new Error("Sesión expirada o sin permisos");
          throw new Error("No se pudo obtener la lista de comedores");
        }

        const data = await response.json();
        setComedores(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error Fetch Comedores:", err);
        setError(err.message);
      } finally {
        // Garantizamos que el spinner se apague siempre
        setLoading(false); 
      }
    };

    fetchComedores();
  }, [id, navigate]);

  return (
    <div className="d-flex flex-column min-vh-100 text-white"
         style={{ 
             background: "linear-gradient(135deg, #000428, #004e92)", 
             overflowY: "auto",
             position: "relative" 
         }}>

      {/* EFECTO DE LUZ DE FONDO */}
      <div style={{ position: "absolute", top: "10%", left: "-5%", width: "400px", height: "400px", background: "rgba(0, 255, 255, 0.05)", borderRadius: "50%", filter: "blur(100px)", zIndex: 0 }}></div>

      <div className="container pt-5 pb-4" style={{ zIndex: 1 }}>
        <button 
            className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2 mb-4 shadow-sm"
            onClick={() => navigate('/dashboard')}
        >
            <FaArrowLeft /> Volver al Dashboard
        </button>
        
        <h2 className="fw-bold d-flex align-items-center gap-3 animate__animated animate__fadeIn">
            <FaUtensils className="text-info" /> 
            Comedores Disponibles
        </h2>
        <p className="text-white-50">Explora los puntos de alimentación de esta facultad.</p>
      </div>

      <div className="container pb-5" style={{ zIndex: 1 }}>
        {loading ? (
            <div className="text-center mt-5 py-5">
                <div className="spinner-border text-info mb-3" role="status" style={{width: "3rem", height: "3rem"}}></div>
                <p className="fs-5 opacity-75">Buscando lugares para comer...</p>
            </div>
        ) : error ? (
            <div className="alert alert-danger bg-danger bg-opacity-25 border-danger text-white text-center rounded-4 p-5">
                <h4>Ocurrió un error</h4>
                <p>{error}</p>
                <button className="btn btn-light mt-3 px-4 rounded-pill fw-bold" onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        ) : comedores.length === 0 ? (
            <div className="text-center mt-5 p-5 rounded-4 animate__animated animate__zoomIn" 
                 style={{ background: "rgba(0,0,0,0.2)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <FaStoreSlash size={80} className="text-white-50 mb-4" />
                <h3 className="fw-bold text-info">No hay locales registrados</h3>
                <p className="text-white-50 fs-5">Parece que esta facultad aún no tiene comedores asignados en el sistema.</p>
                <button className="btn btn-info rounded-pill mt-3 px-4 fw-bold shadow" onClick={() => navigate('/dashboard')}>Explorar otras Facultades</button>
            </div>
        ) : (
            <div className="row g-4 justify-content-center">
                {comedores.map(c => (
                    <div key={c.id} className="col-md-6 col-lg-4 animate__animated animate__fadeInUp">
                        <div 
                            className="card h-100 border-0 shadow-lg text-white"
                            style={{ 
                                background: "rgba(255, 255, 255, 0.08)", 
                                backdropFilter: "blur(20px)",
                                borderRadius: "25px",
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                                transition: "all 0.3s ease",
                                cursor: c.abierto ? "pointer" : "not-allowed"
                            }}
                            onMouseEnter={(e) => c.abierto && (e.currentTarget.style.transform = "translateY(-10px)")}
                            onMouseLeave={(e) => c.abierto && (e.currentTarget.style.transform = "translateY(0)")}
                            onClick={() => c.abierto && navigate(`/comedor/${c.id}`)}
                        >
                            <div className="card-body p-4 d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className={`p-3 rounded-4 shadow-sm ${c.abierto ? 'bg-info bg-opacity-25 text-info' : 'bg-secondary bg-opacity-25 text-white-50'}`}>
                                        <FaDoorOpen size={28} />
                                    </div>
                                    <span className={`badge rounded-pill px-3 py-2 ${c.abierto ? 'bg-success' : 'bg-danger'}`}>
                                        {c.abierto ? 'ABIERTO' : 'CERRADO'}
                                    </span>
                                </div>

                                <h4 className="fw-bold mb-2">{c.nombre}</h4>
                                
                                <div className="d-flex align-items-center gap-2 text-white-50 small mb-3">
                                    <FaMapMarkerAlt className="text-info" />
                                    <span>{c.ubicacion || "Campus UTM"}</span>
                                </div>

                                <p className="small text-white-50 mb-4 flex-grow-1">
                                    {c.descripcion || "Servicio de alimentación universitaria de calidad."}
                                </p>

                                <div className="mt-auto">
                                    <button 
                                        className={`btn w-100 py-2 rounded-pill fw-bold shadow-sm transition-all ${c.abierto ? 'btn-info text-white' : 'btn-outline-secondary disabled'}`}
                                        disabled={!c.abierto}
                                    >
                                        {c.abierto ? "VER MENÚ DE HOY" : "LOCAL CERRADO"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      <footer className="mt-auto py-4 text-center text-white-50 border-top border-white border-opacity-10" style={{ background: "rgba(0,0,0,0.2)" }}>
        <small>© 2026 Universidad Técnica de Manabí - SIGCU System</small>
      </footer>
    </div>
  );
}