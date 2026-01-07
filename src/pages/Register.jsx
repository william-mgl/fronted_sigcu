import { useState, useEffect } from "react";

// URL del backend (Render o Local)
const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [facultades, setFacultades] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    facultad_id: "",
  });

  // =========================
  // CARGAR FACULTADES
  // =========================
  useEffect(() => {
    fetch(`${API_URL}/api/facultades`)
      .then((res) => res.json())
      .then((data) => setFacultades(data))
      .catch((err) =>
        console.error("Error cargando facultades:", err)
      );
  }, []);

  // =========================
  // MANEJO DE INPUTS
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // REGISTRO
  // =========================
  const handleRegister = async () => {
    if (!form.nombre || !form.email || !form.password || !form.facultad_id) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          password: form.password,
          rol: "estudiante",
          facultad_id: form.facultad_id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Cuenta creada con éxito");
        window.location.href = "/login";
      } else {
        alert(data.error || "Error al crear la cuenta");
      }
    } catch (error) {
      console.error("Error registro:", error);
      alert("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister();
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card shadow-lg border-0" style={{ width: "480px" }}>
        <div className="card-body p-5">
          <h3 className="text-center mb-4 fw-bold">
            <i className="bi bi-person-plus-fill me-2 text-success"></i>
            Crear cuenta UTM
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Nombre completo</label>
              <input
                type="text"
                className="form-control form-control-lg"
                name="nombre"
                placeholder="Juan Pérez"
                value={form.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                Correo institucional
              </label>
              <input
                type="email"
                className="form-control form-control-lg"
                name="email"
                placeholder="ejemplo@utm.edu.ec"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control form-control-lg"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Facultad</label>
              <select
                className="form-select form-select-lg"
                name="facultad_id"
                value={form.facultad_id}
                onChange={handleChange}
              >
                <option value="">Seleccione una facultad</option>
                {facultades.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nombre}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-success w-100 btn-lg"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-success fw-semibold">
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
