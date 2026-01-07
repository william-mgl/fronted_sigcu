import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ width: "420px" }}>
        <div className="card-body p-5">
          <h3 className="text-center mb-4 fw-bold">
            <i className="bi bi-mortarboard-fill me-2 text-primary"></i>
            UTM – Comedor Inteligente
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Correo institucional</label>
              <input
                type="email"
                className="form-control form-control-lg"
                placeholder="ejemplo@utm.edu.ec"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="•••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button className="btn btn-primary w-100 btn-lg">
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Iniciar sesión
            </button>
          </form>

          <p className="text-center mt-4">
            ¿No tienes cuenta?{" "}
            <a href="/register" className="text-primary fw-semibold">
              Crear cuenta
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
