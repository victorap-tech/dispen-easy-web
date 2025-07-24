import React, { useEffect, useState } from "react";

const BACKEND_URL = "https://web-production-d4c6.up.railway.app"; // Cambia si hace falta

export default function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const fetchProductos = async () => {
    const r = await fetch(BACKEND_URL + "/productos");
    const data = await r.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const agregarProducto = async (e) => {
    e.preventDefault();
    const r = await fetch(BACKEND_URL + "/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio }),
    });
    await fetchProductos();
    setNombre("");
    setPrecio("");
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Dispen-Easy Web</h1>
      <form onSubmit={agregarProducto}>
        <input
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          placeholder="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <button type="submit">Agregar producto</button>
      </form>
      <hr />
      <h2>Productos</h2>
      <table border="1" cellPadding={4}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Link de Pago</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.nombre}</td>
              <td>${prod.precio}</td>
              <td>
                {prod.link_pago ? (
                  <a href={prod.link_pago} target="_blank" rel="noopener noreferrer">
                    Pagar
                  </a>
                ) : (
                  "Sin link"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
