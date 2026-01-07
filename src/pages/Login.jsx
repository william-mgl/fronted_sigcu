import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) return alert("Ingresa tu correo y contraseña");

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Bienvenido " + data.user.nombre + "!");
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error login:", error);
      alert("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div className="card glass-card shadow-lg p-5" style={{ width: "400px" }}>
        <h3 className="text-center mb-4 fw-bold text-white">
          <i className="bi bi-mortarboard-fill me-2"></i>
          Iniciar Sesión UTM
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-white">
              Correo institucional
            </label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="ejemplo@utm.edu.ec"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-white">Contraseña</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary w-100 btn-lg d-flex justify-content-center align-items-center gap-2"
            type="submit"
            disabled={loading}
          >
            {loading ? "Conectando..." : <><i className="bi bi-box-arrow-in-right"></i> Iniciar sesión</>}
          </button>
        </form>

        <p className="text-center mt-4 text-white">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-info fw-semibold">
            Crear cuenta
          </a>
        </p>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border-radius: 1rem;
        }
        .btn-primary {
          transition: all 0.3s ease;
        }
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          background-color: #0d6efdcc;
        }
        .form-control:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
        }
      `}</style>
    </div>
  );
}
