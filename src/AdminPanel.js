import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

const AdminPanel = () => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [productos, setProductos] = useState([]);

  const obtenerProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

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

      if (res.ok) {
        setNombre("");
        setPrecio("");
        obtenerProductos(); // Refresca la tabla
      } else {
        const error = await res.text();
        console.error("Error al agregar:", error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        obtenerProductos(); // Refresca la tabla
      } else {
        const error = await res.text();
        console.error("Error al eliminar:", error);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
    obtenerProductos();
  }, []);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Panel de Administración</h2>

      <h4>Agregar producto</h4>
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
      <button onClick={handleAgregar}>Agregar</button>

      <h4>Lista de productos</h4>
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
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.precio}</td>
              <td>
                <button onClick={() => handleEliminar(prod.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
