import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaCheckCircle, FaTimesCircle, FaShoppingCart } from "react-icons/fa";

// URL del backend (Render)
const API_URL = import.meta.env.VITE_API_URL;

export default function Comedor() {
  const { comedorId } = useParams();
  const [comedor, setComedor] = useState(null);
  const [menu, setMenu] = useState([]);
  const [user, setUser] = useState(null);

  // Cargar usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Función para cargar datos
  const cargarDatos = () => {
    const token = localStorage.getItem("token");

    // Info del comedor
    fetch(`${API_URL}/api/comedores/facultad/${comedorId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setComedor(data[0])) // asumimos un solo comedor
      .catch((err) => console.error("Error cargando comedor:", err));

    // Menú del día
    fetch(`${API_URL}/api/menu/${comedorId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => res.json())
      .then((data) => setMenu(data || []))
      .catch((err) => console.error("Error cargando menú:", err));
  };

  useEffect(() => {
    if (comedorId) cargarDatos();
  }, [comedorId]);

  // Reservar plato
  const reservarPlato = async (menu_item) => {
    if (!user) return alert("Debes iniciar sesión para reservar");
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ usuario_id: user.id, menu_id: menu_item.menu_id }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Reserva realizada con éxito");
        cargarDatos();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al reservar");
    }
  };

  // Cancelar reserva
  const cancelarReserva = async (reservaId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/reservas/${reservaId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      if (res.ok) {
        alert("Reserva cancelada");
        cargarDatos();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al cancelar reserva");
    }
  };

  if (!comedor) return <div className="text-center mt-5 text-white">Cargando...</div>;

  return (
    <div
      className="container py-5 text-white"
      style={{ background: "linear-gradient(135deg, #004e92, #000428)", minHeight: "100vh" }}
    >
      <header className="mb-5 text-center">
        <h2 className="fw-bold">{comedor.nombre}</h2>
        <p>{comedor.descripcion}</p>
        <p className="d-flex justify-content-center align-items-center gap-2">
          <FaClock /> Capacidad: {comedor.capacidad} personas
        </p>
      </header>

      <main className="row g-4 justify-content-center">
        {menu.length === 0 && (
          <p className="text-center w-100">No hay menú disponible para hoy.</p>
        )}
        {menu.map((p) => (
          <div key={p.menu_id} className="col-md-4">
            <div className="glass-card p-4 rounded-4 shadow-lg text-center">
              <h5 className="fw-bold">{p.nombre}</h5>
              {p.descripcion && <p className="text-muted">{p.descripcion}</p>}
              <div className="my-2">
                <span className="px-3 py-1 rounded-pill fw-semibold bg-light text-dark">
                  ${Number(p.precio || 0).toFixed(2)}
                </span>
              </div>
              <div className="d-flex justify-content-center gap-3 mt-2">
                {p.disponible ? (
                  <button className="btn btn-success" onClick={() => reservarPlato(p)}>
                    <FaShoppingCart /> Reservar
                  </button>
                ) : (
                  <FaTimesCircle className="text-danger" title="No disponible" />
                )}
              </div>
            </div>
          </div>
        ))}
      </main>

      <style>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          transition: transform 0.3s, background 0.3s;
        }
        .glass-card:hover {
          transform: translateY(-5px);
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
