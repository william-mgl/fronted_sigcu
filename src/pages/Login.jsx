import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      setLoading(true);
      await onLogin({ email, password });
    } finally {
      setLoading(false);
    }
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
              <label className="form-label fw-semibold">
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
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary w-100 btn-lg"
              disabled={loading}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
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
