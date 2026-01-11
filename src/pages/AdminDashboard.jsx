const handleLogin = async (e) => {
  e.preventDefault();
  
  // PROBAMOS CON LA URL DIRECTA PARA DESCARTAR ERRORES DE VARIABLES
  const URL_PRUEBA = "https://backend-sigcu-9khe.onrender.com/api/auth/login";

  try {
    const res = await fetch(URL_PRUEBA, {
      method: "POST", // El navegador dio error porque usó GET, aquí usamos POST
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: email, 
        password: password 
      }),
    });

    const data = await res.json();

    if (res.ok) {
      if (data.user.rol === "admin") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/admin-panel");
      } else {
        alert("Acceso denegado: No eres administrador");
      }
    } else {
      alert("Error: " + (data.error || "Credenciales inválidas"));
    }
  } catch (error) {
    console.error("Error en la petición:", error);
    alert("No se pudo conectar con el servidor. Revisa tu conexión.");
  }
};