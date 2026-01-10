import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaUniversity, FaUserPlus, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [facultadId, setFacultadId] = useState("");
  
  // Datos y Feedback
  const [facultades, setFacultades] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // 1. Cargar Facultades automáticamente al entrar
  useEffect(() => {
    fetch(`${API_URL}/facultades`)
      .then(res => {
        if (!res.ok) throw new Error("Error fetching facultades");
        return res.json();
      })
      .then(data => setFacultades(data))
      .catch(err => console.error("Error cargando facultades", err));
  }, []);

  // 2. Manejar el Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!facultadId) {
        setError("Por favor selecciona tu facultad");
        return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            nombre, 
            email, 
            password, 
            facultad_id: facultadId, 
            rol: 'estudiante' // Siempre creamos estudiantes por defecto aquí
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Esperamos 2 segundos mostrando el éxito y redirigimos
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        setError(data.error || "Error al registrarse. Intenta con otro correo.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 p-4"
         style={{ 
             background: "linear-gradient(135deg, #000428, #004e92)", 
             overflow: "hidden",
             position: "relative"
         }}>

      {/* ELEMENTOS DE FONDO (Ambientación) */}
      <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "400px", height: "400px", background: "rgba(0, 255, 127, 0.1)", borderRadius: "50%", filter: "blur(80px)" }}></div>
      <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: "300px", height: "300px", background: "rgba(255, 0, 128, 0.1)", borderRadius: "50%", filter: "blur(60px)" }}></div>

      {/* TARJETA GLASSMORPHISM */}
      <div className="card border-0 shadow-lg p-4 animate__animated animate__fadeInUp"
           style={{
               width: "100%",
               maxWidth: "500px",
               background: "rgba(255, 255, 255, 0.1)", 
               backdropFilter: "blur(16px)",
               borderRadius: "20px",
               border: "1px solid rgba(255, 255, 255, 0.2)"
           }}>
        
        {/* HEADER DE LA TARJETA */}
        <div className="text-center text-white mb-4">
            {success ? (
                <div className="animate__animated animate__bounceIn">
                    <FaCheckCircle size={60} className="text-success mb-3" />
                    <h2 className="fw-bold">¡Cuenta Creada!</h2>
                    <p>Redirigiendo al login...</p>
                </div>
            ) : (
                <>
                    <div className="mb-3 bg-white bg-opacity-10 rounded-circle d-inline-flex p-3 shadow-sm">
                        <FaUserPlus size={40} className="text-info" />
                    </div>
                    <h2 className="fw-bold">Crear Cuenta</h2>
                    <p className="text-white-50 small">Únete a la comunidad universitaria</p>
                </>
            )}
        </div>

        {!success && (
            <form onSubmit={handleRegister} className="d-flex flex-column gap-3">
                
                {/* ALERTA DE ERROR */}
                {error && (
                    <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 animate__animated animate__shakeX">
                        ❌ {error}
                    </div>
                )}

                {/* INPUT: NOMBRE */}
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-dark border-secondary text-info"><FaUser /></span>
                    <input 
                        type="text" 
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="Nombre Completo"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                </div>

                {/* INPUT: EMAIL */}
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-dark border-secondary text-info"><FaEnvelope /></span>
                    <input 
                        type="email" 
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="Correo Institucional"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {/* INPUT: PASSWORD */}
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-dark border-secondary text-info"><FaLock /></span>
                    <input 
                        type="password" 
                        className="form-control bg-dark border-secondary text-white"
                        placeholder="Contraseña Segura"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {/* SELECT: FACULTAD */}
                <div className="input-group input-group-lg">
                    <span className="input-group-text bg-dark border-secondary text-info"><FaUniversity /></span>
                    <select 
                        className="form-select bg-dark border-secondary text-white"
                        value={facultadId}
                        onChange={(e) => setFacultadId(e.target.value)}
                        required
                        style={{ cursor: "pointer" }}
                    >
                        <option value="">Selecciona tu Facultad...</option>
                        {facultades.map(f => (
                            <option key={f.id} value={f.id}>{f.nombre}</option>
                        ))}
                    </select>
                </div>

                {/* BOTÓN REGISTRAR */}
                <button 
                    type="submit" 
                    className="btn btn-info btn-lg w-100 fw-bold mt-2 shadow text-white hover-scale"
                    style={{ borderRadius: "10px", transition: "0.3s" }}
                >
                    🚀 Registrarme
                </button>
            </form>
        )}

        {/* FOOTER: VOLVER AL LOGIN */}
        <div className="text-center mt-4 border-top border-secondary pt-3">
            <button 
                onClick={() => navigate('/login')} 
                className="btn btn-link text-white-50 text-decoration-none d-flex align-items-center justify-content-center gap-2 mx-auto"
                style={{ fontSize: "0.9rem" }}
            >
                <FaArrowLeft /> Volver al inicio de sesión
            </button>
        </div>

      </div>
    </div>
  );
}