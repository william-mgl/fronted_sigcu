import { useState, useEffect } from "react";

export default function Register() {
  const [facultades, setFacultades] = useState([]);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    facultad_id: "",
  });

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/facultades`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFacultades(data);
        } else {
          console.error("Error backend facultades:", data);
          setFacultades([]);
        }
      })
      .catch((err) => {
        console.error("Error cargando facultades:", err);
        setFacultades([]);
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        alert("Error: " + (data.error || "Error desconocido"));
      }
    } catch (error) {
      console.error(error);
      alert("Error en la petición al servidor");
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
            Crear cuenta UTM
          </h3>

          <form onSubmit={handleSubmit}>
            <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} />
            <input name="email" placeholder="Correo" value={form.email} onChange={handleChange} />
            <input name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} />
            <select name="facultad_id" value={form.facultad_id} onChange={handleChange}>
              <option value="">Seleccione una facultad</option>
              {Array.isArray(facultades) &&
                facultades.map((f) => (
                  <option key={f.id} value={f.id}>{f.nombre}</option>
                ))}
            </select>
            <button>Crear cuenta</button>
          </form>
        </div>
      </div>
    </div>
  );
}
