import { HashRouter, Routes, Route, useNavigate } from "react-router-dom"; 
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Comedores from "./pages/Comedores";
import Comedor from "./pages/Comedor";
import AdminDashboard from './pages/AdminDashboard';

const API_URL = import.meta.env.VITE_API_URL;

function AppContent() {
  const navigate = useNavigate(); 

  // Función para registrar usuario
  const handleRegister = async (form) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Cuenta creada correctamente. Ahora inicia sesión.");
        navigate("/login"); 
      } else {
        alert(data.error || "Error creando la cuenta");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error conectando al servidor");
    }
  };

  // Función para iniciar sesión
  const handleLogin = async (form) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Bienvenido!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard"); 
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error conectando al servidor");
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register onRegister={handleRegister} />} />
      
      <Route path="/dashboard" element={<Dashboard />} />

      {/* --- CORRECCIÓN AQUÍ: Cambiamos :facultadId por :id --- */}
      <Route path="/comedores/:id" element={<Comedores />} />

      {/* --- SUGERENCIA: Hacemos lo mismo con Comedor para evitar errores futuros --- */}
      <Route path="/comedor/:id" element={<Comedor />} />
      
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;