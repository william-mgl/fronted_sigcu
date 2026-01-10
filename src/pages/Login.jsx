import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUniversity, FaUserShield, FaIdCard, FaSignInAlt, FaUserPlus } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  
  // Estado para el switch: 'cliente' o 'admin'
  const [view, setView] = useState("cliente"); 
  
  // Estados del formulario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");
  const [adminName, setAdminName] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Definir URL y Datos según quién intenta entrar
    const endpoint = view === "cliente" ? "/login" : "/admin-login";
    
    const bodyData = view === "cliente" 
        ? { email, password } 
        : { adminId, adminName };

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar token y usuario
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir según el rol
        if (view === "admin" || data.user.rol === "admin_comedor") {
            navigate("/admin-dashboard");
        } else {
            navigate("/dashboard");
        }
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100"
         style={{ 
             background: "radial-gradient(circle at center, #1a2a6c, #b21f1f, #fdbb2d)", // Opción A: Colorido
             // Opción B (Más serio): background: "linear-gradient(135deg, #004e92, #000428)", 
             background: "linear-gradient(135deg, #000428, #004e92)", 
             overflow: "hidden"
         }}>
      
      {/* CÍRCULOS DECORATIVOS DE FONDO (Efecto moderno) */}
      <div style={{ position: "absolute", top: "10%", left: "20%", width: "300px", height: "300px", background: "rgba(255,255,255,0.05)", borderRadius: "50%", filter: "blur(50px)" }}></div>
      <div style={{ position: "absolute", bottom: "10%", right: "20%", width: "200px", height: "200px", background: "rgba(0,128,255,0.1)", borderRadius: "50%", filter: "blur(40px)" }}></div>

      {/* TARJETA GLASSMORPHISM */}
      <div className="card border-0 shadow-lg p-4"
           style={{
               width: "100%",
               maxWidth: "450px",
               background: "rgba(255, 255, 255, 0.1)", // Transparencia
               backdropFilter: "blur(16px)", // Efecto borroso
               borderRadius: "20px",
               border: "1px solid rgba(255, 255, 255, 0.2)"
           }}>
        
        <div className="text-center text-white mb-4">
            <div className="mb-3">
                {view === "cliente" ? (
                    <FaUniversity size={50} className="text-info animate__animated animate__fadeIn" />
                ) : (
                    <FaUserShield size={50} className="text-warning animate__animated animate__fadeIn" />
                )}
            </div>
            <h2 className="fw-bold">Bienvenido</h2>
            <p className="text-white-50 small">Sistema de Comedores Universitarios</p>
        </div>

        {/* SWITCH TIPO PESTAÑAS */}
        <div className="d-flex justify-content-center mb-4 bg-dark bg-opacity-50 rounded-pill p-1">
            <button 
                className={`btn rounded-pill w-50 fw-bold transition-all ${view === 'cliente' ? 'btn-primary shadow' : 'text-white'}`}
                onClick={() => { setView('cliente'); setError(null); }}
                style={{ transition: "0.3s" }}
            >
                Estudiantes
            </button>
            <button 
                className={`btn rounded-pill w-50 fw-bold transition-all ${view === 'admin' ? 'btn-warning text-dark shadow' : 'text-white'}`}
                onClick={() => { setView('admin'); setError(null); }}
                style={{ transition: "0.3s" }}
            >
                Admin View
            </button>
        </div>

        {/* ALERTA DE ERROR */}
        {error && (
            <div className="alert alert-danger d-flex align-items-center gap-2 py-2 small" role="alert">
                ❌ {error}
            </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            
            {view === "cliente" ? (
                // --- VISTA ESTUDIANTE ---
                <>
                    <div className="input-group input-group-lg">
                        <span className="input-group-text bg-dark border-secondary text-secondary"><FaUser /></span>
                        <input 
                            type="email" 
                            className="form-control bg-dark border-secondary text-white placeholder-gray"
                            placeholder="Correo Institucional"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group input-group-lg">
                        <span className="input-group-text bg-dark border-secondary text-secondary"><FaLock /></span>
                        <input 
                            type="password" 
                            className="form-control bg-dark border-secondary text-white"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </>
            ) : (
                // --- VISTA ADMIN ---
                <>
                    <div className="input-group input-group-lg">
                        <span className="input-group-text bg-dark border-secondary text-warning"><FaIdCard /></span>
                        <input 
                            type="text" 
                            className="form-control bg-dark border-secondary text-white"
                            placeholder="ID de Administrador"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group input-group-lg">
                        <span className="input-group-text bg-dark border-secondary text-warning"><FaUserShield /></span>
                        <input 
                            type="text" 
                            className="form-control bg-dark border-secondary text-white"
                            placeholder="Nombre de Usuario"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            required
                        />
                    </div>
                </>
            )}

            <button 
                type="submit" 
                className={`btn btn-lg w-100 fw-bold mt-3 shadow ${view === 'cliente' ? 'btn-info text-white' : 'btn-warning text-dark'}`}
                style={{ borderRadius: "10px" }}
            >
                <FaSignInAlt className="me-2" /> 
                {view === 'cliente' ? 'Iniciar Sesión' : 'Acceder al Panel'}
            </button>

        </form>

        {/* FOOTER */}
        {view === "cliente" && (
            <div className="text-center mt-4">
                <span className="text-white-50">¿No tienes cuenta? </span>
                <button 
                    onClick={() => navigate('/register')} // Asumiendo que tienes una ruta /register
                    className="btn btn-link text-info text-decoration-none fw-bold p-0"
                >
                    <FaUserPlus className="me-1"/> Regístrate aquí
                </button>
            </div>
        )}

      </div>
    </div>
  );
}