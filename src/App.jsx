import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Comedores from "./pages/Comedores";
import Comedor from "./pages/Comedor";
import AdminPanel from "./pages/AdminPanel"; // 1. IMPORTANTE: Importar el panel

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const handleRegister = async (form) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok) {
        alert("Cuenta creada correctamente. Ahora inicia sesión.");
        window.location.href = "/login";
      } else {
        alert(data.error || "Error creando la cuenta");
      }
    } catch (error) {
      console.error("Error register:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  const handleLogin = async (form) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // 2. LÓGICA DE REDIRECCIÓN POR ROL
        if (data.user.rol === "admin") {
          alert("Bienvenido, Administrador");
          window.location.href = "/admin-panel";
        } else {
          alert("Bienvenido!");
          window.location.href = "/dashboard";
        }
      } else {
        alert(data.error || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error login:", error);
      alert("No se pudo conectar con el servidor");
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 3. NUEVA RUTA DE ADMIN */}
        <Route path="/admin-panel" element={<AdminPanel />} />

        {/* Parámetros corregidos para coincidir con tus componentes anteriores */}
        <Route path="/comedores/:id" element={<Comedores />} />
        <Route path="/comedor/:id" element={<Comedor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;