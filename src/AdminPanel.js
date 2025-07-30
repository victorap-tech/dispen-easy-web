import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  // Obtener productos al cargar
  const obtenerProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  // Agregar producto
  const handleAgregar = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          precio: parseFloat(precio),
          cantidad_ml: 500,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setNombre("");
        setPrecio("");
        obtenerProductos(); // 🔄 Refrescar la tabla
      } else {
        console.error("Error al agregar:", data);
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  // Eliminar producto
  const handleEliminar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.ok) {
        obtenerProductos(); // 🔄 Refrescar la tabla
      } else {
        console.error("Error al eliminar:", data);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Panel de Administración</h2>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={handleAgregar}>Agregar Producto</button>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio ($)</th>
            <th>Cantidad (ml)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.cantidad_ml}</td>
              <td>
                <button onClick={() => handleEliminar(producto.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {productos.length === 0 && (
            <tr>
              <td colSpan="5">No hay productos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
