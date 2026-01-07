import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
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
            UTM – Comedor Inteligente
          </h3>

          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} className="form-control mb-3" />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="form-control mb-3" />
            <button className="btn btn-primary w-100">Iniciar sesión</button>
          </form>

          <p className="text-center mt-4">
            ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
