import React, { useState, useEffect } from "react";

// Usuario/contraseña hardcodeados para login
const USER = "admin";
const PASS = "1234";

function App() {
  const [logueado, setLogueado] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const backendUrl = "https://web-production-d4c6.up.railway.app/"; // Cambiá por tu backend Railway

  // Handler login
  const login = (e) => {
    e.preventDefault();
    if (usuario === USER && contrasena === PASS) {
      setLogueado(true);
      setErrorLogin("");
      setUsuario("");
      setContrasena("");
    } else {
      setErrorLogin("Usuario o contraseña incorrectos");
    }
  };

  useEffect(() => {
    if (logueado) {
      fetch(`${backendUrl}/productos`)
        .then((res) => res.json())
        .then(setProductos);
    }
  }, [logueado]);

  const handleAgregar = (e) => {
    e.preventDefault();
    if (!nombre || !precio) return;
    fetch(`${backendUrl}/productos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio }),
    })
      .then((res) => res.json())
      .then((prods) => {
        setProductos(prods);
        setNombre("");
        setPrecio("");
      });
  };

  // Cerrar sesión
  const logout = () => setLogueado(false);

  // --- Generador e impresor de QR ---
  const imprimirQR = (producto) => {
    // Usamos API de QR externa rápida (puede ser cualquier otra si preferís)
    const urlQR = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(producto.link_pago)}`;
    // Arma el HTML a imprimir
    const html = `
      <div style="text-align:center; font-family:sans-serif;">
        <h2>${producto.nombre}</h2>
        <p style="font-size:22px; margin:12px 0;">Precio: $${producto.precio}</p>
        <img src="${urlQR}" alt="QR Link Pago" /><br>
        <small>${producto.link_pago}</small>
      </div>
      <script>window.onload = function() { window.print(); }</script>
    `;
    const w = window.open("", "_blank", "width=400,height=600");
    w.document.write(html);
    w.document.close();
  };

  // --- LOGIN FORM ---
  if (!logueado) {
    return (
      <div style={{ maxWidth: 350, margin: "80px auto", fontFamily: "sans-serif" }}>
        <h2>Login Administrador</h2>
        <form onSubmit={login}>
          <input
            type="text"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            style={{ display: "block", marginBottom: 12, padding: 6, width: "100%" }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            style={{ display: "block", marginBottom: 12, padding: 6, width: "100%" }}
          />
          <button type="submit" style={{ padding: 8, width: "100%" }}>Ingresar</button>
        </form>
        {errorLogin && <p style={{ color: "red" }}>{errorLogin}</p>}
      </div>
    );
  }

  // --- PANEL ADMIN ---
  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Dispen-Easy – Administración</h2>
        <button onClick={logout} style={{ height: 36, alignSelf: "center" }}>Cerrar sesión</button>
      </div>

      <form onSubmit={handleAgregar} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ marginRight: 10, padding: 6, width: 180 }}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          style={{ marginRight: 10, padding: 6, width: 100 }}
        />
        <button type="submit" style={{ padding: 6 }}>Agregar</button>
      </form>

      <table width="100%" border="1" cellSpacing="0" style={{ textAlign: "center" }}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Link de pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>
                {p.link_pago
                  ? (
                    <a href={p.link_pago} target="_blank" rel="noopener noreferrer">
                      Ir al link
                    </a>
                  )
                  : "—"}
              </td>
              <td>
                {p.link_pago && (
                  <>
                    <button
                      onClick={() => navigator.clipboard.writeText(p.link_pago)}
                      style={{ marginRight: 6 }}
                    >
                      Copiar link
                    </button>
                    <button
                      onClick={() => imprimirQR(p)}
                    >
                      Imprimir QR
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
