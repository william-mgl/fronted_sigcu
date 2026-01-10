import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUtensils, FaMoneyBillWave, FaClock, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Comedor() {
  // 1. AHORA USAMOS 'id' PARA QUE COINCIDA CON APP.JSX
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [menu, setMenu] = useState([]);
  const [infoComedor, setInfoComedor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null); // Para alertas bonitas

  // Obtener datos del usuario para saber si tiene saldo (visual)
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!id) return;

    // A) Cargar Información del Comedor (Nombre, capacidad...)
    fetch(`${API_URL}/comedores/${id}`)
      .then(res => res.json())
      .then(data => setInfoComedor(data))
      .catch(err => console.error("Error info comedor:", err));

    // B) Cargar Menú del día
    // IMPORTANTE: Asegúrate de que tu backend tenga esta ruta. 
    // Si antes usabas otra ruta, ajústala aquí.
    fetch(`${API_URL}/menus/comedor/${id}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
            setMenu(data);
        } else {
            setMenu([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error cargando menú:", err);
        setMenu([]);
        setLoading(false);
      });
  }, [id]);

  // Función para comprar
  const handleCompra = async (plato) => {
    if (!user) {
        navigate("/login");
        return;
    }

    if (!window.confirm(`¿Confirmar compra de ${plato.nombre} por $${plato.precio}?`)) return;

    try {
      const res = await fetch(`${API_URL}/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          usuario_id: user.id,
          menu_id: plato.id // ID del menú (tabla menu_dia)
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Mensaje de éxito
        setMensaje({ type: 'success', text: `✅ ¡Disfruta tu ${plato.nombre}!` });
        
        // Actualizar stock visualmente (opcional)
        setMenu(prev => prev.map(item => 
            item.id === plato.id 
            ? { ...item, cantidad_disponible: item.cantidad_disponible - 1 } 
            : item
        ));

        // Limpiar mensaje a los 3 seg
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setMensaje({ type: 'error', text: `❌ ${data.error}` });
        setTimeout(() => setMensaje(null), 4000);
      }
    } catch (err) {
      console.error(err);
      setMensaje({ type: 'error', text: "❌ Error de conexión" });
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 text-white"
         style={{ 
             background: "linear-gradient(135deg, #000428, #004e92)", 
             overflowY: "auto",
             position: "relative"
         }}>

      {/* HEADER AMBIENTAL */}
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "600px", height: "600px", background: "rgba(255, 165, 0, 0.05)", borderRadius: "50%", filter: "blur(120px)", zIndex: 0 }}></div>

      {/* NAVBAR */}
      <div className="container pt-4 pb-2 position-relative" style={{ zIndex: 10 }}>
        <button 
            className="btn btn-outline-light rounded-pill px-4 d-flex align-items-center gap-2 mb-3 hover-scale"
            onClick={() => navigate(-1)} // Volver atrás
            style={{ backdropFilter: "blur(5px)" }}
        >
            <FaArrowLeft /> Regresar
        </button>

        {infoComedor ? (
            <div className="animate__animated animate__fadeInLeft">
                <h2 className="fw-bold display-6">{infoComedor.nombre}</h2>
                <p className="text-white-50 d-flex align-items-center gap-2">
                    <FaUtensils /> Menú del Día &bull; <span className="text-success">Abierto ahora</span>
                </p>
            </div>
        ) : (
            <div className="spinner-border text-light spinner-border-sm" role="status"></div>
        )}
      </div>

      {/* ALERTA FLOTANTE (FEEDBACK) */}
      {mensaje && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-4 p-3 rounded-4 shadow-lg animate__animated animate__fadeInDown"
             style={{ 
                 zIndex: 100, 
                 background: mensaje.type === 'success' ? 'rgba(40, 167, 69, 0.9)' : 'rgba(220, 53, 69, 0.9)',
                 backdropFilter: "blur(10px)",
                 minWidth: "300px",
                 textAlign: "center"
             }}>
             <h5 className="m-0 fw-bold text-white">{mensaje.text}</h5>
        </div>
      )}

      {/* LISTA DE PLATOS (GRID) */}
      <div className="container pb-5 mt-4 position-relative" style={{ zIndex: 1 }}>
        {loading ? (
            <div className="text-center mt-5 opacity-50">
                <div className="spinner-border text-warning mb-3" role="status"></div>
                <p>El chef está preparando el menú...</p>
            </div>
        ) : menu.length === 0 ? (
            <div className="text-center p-5 rounded-4 bg-white bg-opacity-10 backdrop-blur">
                <FaExclamationTriangle size={50} className="text-warning mb-3" />
                <h3>No hay menú disponible hoy</h3>
                <p>Intenta revisar más tarde.</p>
            </div>
        ) : (
            <div className="row g-4">
                {menu.map(plato => (
                    <div key={plato.id} className="col-md-6 col-lg-4">
                        <div className="card h-100 border-0 shadow-lg overflow-hidden hover-card"
                             style={{ 
                                 background: "rgba(255, 255, 255, 0.08)", 
                                 backdropFilter: "blur(16px)",
                                 borderRadius: "20px",
                                 border: "1px solid rgba(255, 255, 255, 0.1)"
                             }}>
                            
                            {/* IMAGEN DEL PLATO (Si tienes URL úsala, sino icono) */}
                            <div className="card-img-top d-flex align-items-center justify-content-center bg-dark bg-opacity-50" style={{ height: "180px" }}>
                                {plato.imagen_url ? (
                                    <img src={plato.imagen_url} alt={plato.nombre} className="w-100 h-100 object-fit-cover" />
                                ) : (
                                    <FaUtensils size={60} className="text-white-50" />
                                )}
                            </div>

                            <div className="card-body d-flex flex-column">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h4 className="fw-bold text-white m-0">{plato.nombre}</h4>
                                    <span className="badge bg-warning text-dark fs-6 rounded-pill">
                                        ${plato.precio}
                                    </span>
                                </div>
                                
                                <p className="text-white-50 small flex-grow-1">
                                    {plato.descripcion || "Delicioso plato preparado con ingredientes frescos."}
                                </p>

                                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-secondary">
                                    <small className={`fw-bold d-flex align-items-center gap-1 ${plato.cantidad_disponible > 0 ? 'text-success' : 'text-danger'}`}>
                                        <FaClock /> Stock: {plato.cantidad_disponible}
                                    </small>
                                    
                                    <button 
                                        onClick={() => handleCompra(plato)}
                                        disabled={plato.cantidad_disponible <= 0}
                                        className={`btn px-4 rounded-pill fw-bold shadow-sm transition-all ${plato.cantidad_disponible > 0 ? 'btn-success hover-scale' : 'btn-secondary'}`}
                                    >
                                        {plato.cantidad_disponible > 0 ? (
                                            <> <FaMoneyBillWave className="me-2"/> Comprar </>
                                        ) : "Agotado"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

    </div>
  );
}