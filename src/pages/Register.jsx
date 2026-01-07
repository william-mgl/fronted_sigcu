import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function Register({ onRegister }) {
  const navigate = useNavigate();
  const [facultades, setFacultades] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    facultad_id: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/api/facultades`)
      .then(res => res.json())
      .then(data => setFacultades(data))
      .catch(err => console.error("Error cargando facultades", err));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rol: "estudiante",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Cuenta creada con éxito");
        navigate("/login");
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error en la petición");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ width: "480px" }}>
        <div className="card-body p-5">
          <h3 className="text-center mb-4 fw-bold">
            Crear cuenta UTM
          </h3>

          <form onSubmit={handleRegisterSubmit}>
            <input type="text" placeholder="Nombre" name="nombre" value={form.nombre} onChange={handleChange} className="form-control mb-3" />
            <input type="email" placeholder="Correo" name="email" value={form.email} onChange={handleChange} className="form-control mb-3" />
            <input type="password" placeholder="Contraseña" name="password" value={form.password} onChange={handleChange} className="form-control mb-3" />
            <select name="facultad_id" value={form.facultad_id} onChange={handleChange} className="form-select mb-3">
              <option value="">Seleccione facultad</option>
              {facultades.map(f => (
                <option key={f.id} value={f.id}>{f.nombre}</option>
              ))}
            </select>
            <button className="btn btn-success w-100">Crear cuenta</button>
          </form>

          <p className="text-center mt-4">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
