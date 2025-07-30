import React, { useEffect, useState, useCallback } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });

  const obtenerProductos = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }, []);

  const agregarProducto = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoProducto),
      });
      const data = await res.json();
      if (data.success) {
        setNuevoProducto({ nombre: "", precio: "" });
        obtenerProductos();
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        obtenerProductos();
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Panel de Administración</h2>

      <h3>Agregar producto</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={nuevoProducto.nombre}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
      />
      <input
        type="text"
        placeholder="Precio"
        value={nuevoProducto.precio}
        onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
      />
      <button onClick={agregarProducto}>Agregar</button>

      <h3>Lista de productos</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.id}</td>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>
                <button onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;