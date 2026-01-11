import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUniversity, FaUserShield, FaSignInAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {
  const navigate = useNavigate();
  const [view, setView] = useState("estudiante"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // UNIFICADO: Usamos la ruta que confirmamos que funciona
    const endpoint = "/api/auth/login"; 

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Evitar el error de "Unexpected token <" validando si es JSON
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no respondió correctamente. Contacta al soporte.");
      }

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirigir según el rol real guardado en la Base de Datos
        if (data.user.rol === "admin") {
          navigate("/admin-panel");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100"
         style={{ background: "linear-gradient(135deg, #000428, #004e92)" }}>
      
      <div className="card border-0 shadow-lg p-4"
           style={{
               width: "100%", maxWidth: "420px",
               background: "rgba(255, 255, 255, 0.1)",
               backdropFilter: "blur(15px)", borderRadius: "20px",
               border: "1px solid rgba(255, 255, 255, 0.2)"
           }}>
        
        <div className="text-center text-white mb-4">
            <div className="mb-3">
                {view === "estudiante" ? <FaUniversity size={50} className="text-info" /> : <FaUserShield size={50} className="text-warning" />}
            </div>
            <h2 className="fw-bold">Acceso UTM</h2>
            <p className="text-white-50 small">Inicia sesión como {view}</p>
        </div>

        <div className="d-flex justify-content-center mb-4 bg-dark bg-opacity-50 rounded-pill p-1">
            <button className={`btn rounded-pill w-50 fw-bold ${view === 'estudiante' ? 'btn-primary shadow' : 'text-white'}`}
                    onClick={() => { setView('estudiante'); setError(null); }}>Estudiante</button>
            <button className={`btn rounded-pill w-50 fw-bold ${view === 'admin' ? 'btn-warning text-dark shadow' : 'text-white'}`}
                    onClick={() => { setView('admin'); setError(null); }}>Admin</button>
        </div>

        {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
            <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary"><FaUser /></span>
                <input type="email" className="form-control bg-dark border-secondary text-white"
                       placeholder="Correo Institucional" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-secondary"><FaLock /></span>
                <input type="password" className="form-control bg-dark border-secondary text-white"
                       placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" disabled={loading}
                    className={`btn btn-lg w-100 fw-bold mt-2 ${view === 'estudiante' ? 'btn-info text-white' : 'btn-warning text-dark'}`}>
                {loading ? "Procesando..." : <><FaSignInAlt className="me-2" /> Entrar</>}
            </button>
        </form>

        {view === "estudiante" && (
            <div className="text-center mt-4">
                <button onClick={() => navigate('/register')} className="btn btn-link text-info text-decoration-none small">
                    ¿No tienes cuenta? Regístrate aquí
                </button>
            </div>
        )}
      </div>
    </div>
  );
}