import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWallet,
  FaSignOutAlt,
  FaUser,
  FaBookOpen,
  FaUtensils,
  FaShoppingCart,
} from "react-icons/fa";

// URL del backend (Render)
const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [facultades, setFacultades] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);

  // =========================
  // VALIDAR SESIÓN
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // =========================
  // CARGAR DATOS
  // =========================
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    Promise.all([
      fetch(`${API_URL}/api/facultades`, { headers }),
      fetch(`${API_URL}/api/reservas/${user.id}`, { headers }),
      fetch(`${API_URL}/api/usuarios/${user.id}`, { headers }),
    ])
      .then(async ([facRes, resRes, userRes]) => {
        const facultadesData = await facRes.json();
        const historialData = await resRes.json();
        const usuarioData = await userRes.json();

        setFacultades(facultadesData || []);
        setHistorial(historialData || []);
        setSaldo(Number(usuarioData.saldo) || 0);
      })
      .catch((err) => {
        console.error("Error cargando dashboard:", err);
        alert("Error cargando información del usuario");
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="text-center mt-5 text-white">
        Cargando información...
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div
      className="d-flex flex-column align-items-center vh-100 text-white"
      style={{ background: "linear-gradient(135deg, #004e92, #000428)" }}
    >
      {/* HEADER */}
      <header className="w-100 p-4 d-flex justify-content-between align-items-center">
        <h2 className="fw-bold d-flex align-items-center gap-2">
          <FaUser /> Bienvenido, {user.nombre}
        </h2>

        <div className="d-flex align-items-center gap-3">
          <span className="fw-bold d-flex align-items-center gap-1">
            <FaWallet /> ${saldo.toFixed(2)}
          </span>

          <button
            className="btn btn-outline-light d-flex align-items-center gap-1"
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
          >
            <FaSignOutAlt /> Cerrar sesión
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mt-5 d-flex justify-content-center flex-wrap gap-4">
        {/* FACULTADES */}
        <div
          className="col-md-5 p-4 rounded-4 shadow-lg text-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <h4 className="mb-4 d-flex justify-content-center gap-2">
            <FaBookOpen /> Facultades
          </h4>

          <ul className="list-unstyled">
            {facultades.length === 0 && (
              <li>No hay facultades disponibles</li>
            )}

            {facultades.map((f) => (
              <li
                key={f.id}
                className="p-3 my-2 rounded-3 cursor-pointer d-flex justify-content-center gap-2"
                style={{ background: "rgba(255,255,255,0.1)" }}
                onClick={() => navigate(`/comedores/${f.id}`)}
              >
                <FaUtensils /> {f.nombre}
              </li>
            ))}
          </ul>
        </div>

        {/* HISTORIAL */}
        <div
          className="col-md-5 p-4 rounded-4 shadow-lg text-center"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <h4 className="mb-4 d-flex justify-content-center gap-2">
            <FaShoppingCart /> Historial
          </h4>

          <ul className="list-unstyled">
            {historial.length === 0 && (
              <li>No has realizado compras aún</li>
            )}

            {historial.map((r) => (
              <li
                key={r.id}
                className="p-2 my-2 rounded-3"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                {r.plato_nombre} –{" "}
                {new Date(r.fecha_reserva).toLocaleDateString()} – {r.estado}
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-auto p-3 opacity-50 text-center w-100">
        <small>
          © 2025 Universidad Técnica de Manabí – Sistema Comedor Inteligente
        </small>
      </footer>
    </div>
  );
}
