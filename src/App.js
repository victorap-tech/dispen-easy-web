import React, { useEffect, useState } from "react";

function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch("https://web-production-d4c6.up.railway.app/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch(() => alert("No se pudo conectar al backend."));
  }, []);

  return (
    <div>
      <h1>Dispen-Easy Web</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio ($)</th>
            <th>Link de pago</th>
            <th>Ver QR</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>
                <a href={p.link_pago} target="_blank" rel="noopener noreferrer">
                  Ir a pagar
                </a>
              </td>
              <td>
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                    p.link_pago
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver QR
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
