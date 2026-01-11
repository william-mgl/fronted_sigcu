const handleLogin = async (e) => {
  e.preventDefault();
  setMensaje(null);

  try {
    // 1. Cambiamos la URL a la ruta de login general
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        email: email, // Asegúrate de que coincida con lo que pide tu backend
        password: password 
      }),
    });

    // Intentamos parsear la respuesta
    const data = await res.json();

    if (res.ok) {
      // 2. VERIFICACIÓN DE ROL: Solo permitimos entrar si es admin
      if (data.user.rol === "admin") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setMensaje({ type: "success", text: "Bienvenido, Administrador" });
        
        // Redirigimos al panel
        setTimeout(() => navigate("/admin-panel"), 1500);
      } else {
        // Si los datos son correctos pero no es admin
        setMensaje({ 
          type: "error", 
          text: "❌ Acceso denegado: Se requieren permisos de administrador." 
        });
      }
    } else {
      // Si el servidor responde con error (401, 400, etc.)
      setMensaje({ type: "error", text: data.error || "Credenciales incorrectas" });
    }
  } catch (error) {
    console.error("Error connection:", error);
    setMensaje({ type: "error", text: "Error de conexión con el servidor" });
  }
};