import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // USAMOS LA RUTA QUE SÍ EXISTE (login general)
    const URL_CORRECTA = "https://backend-sigcu-9khe.onrender.com/api/auth/login";

    try {
      const res = await fetch(URL_CORRECTA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // Verificamos si la respuesta es JSON antes de leerla
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("El servidor no respondió con JSON. Revisa la ruta en el Backend.");
      }

      const data = await res.json();

      if (res.ok) {
        // VALIDACIÓN DE ROL EN EL FRONTEND
        if (data.user.rol === "admin") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          navigate("/admin-panel");
        } else {
          setError("❌ No tienes permisos de administrador.");
        }
      } else {
        setError("❌ " + (data.error || "Credenciales incorrectas"));
      }
    } catch (err) {
      console.error("Error detallado:", err);
      setError("❌ Error de conexión o ruta inexistente.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleLogin} className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Login Administrador</h2>
        
        {error && <div className="alert alert-danger p-2 small">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input 
            type="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Entrar como Admin
        </button>
      </form>
    </div>
  );
}