import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL;

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  // Obtener productos desde el backend
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
    const precioFloat = parseFloat(precio);
    if (!nombre || isNaN(precioFloat)) {
      alert("Ingrese un nombre y un precio válido");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          precio: precioFloat,
          cantidad_ml: 500,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNombre("");
        setPrecio("");
        obtenerProductos(); // refresca la tabla
      } else {
        alert("Error al agregar producto");
      }
    } catch (error) {
      console.error("Error en handleAgregar:", error);
    }
  };

  // Eliminar producto
  const handleEliminar = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/productos/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        obtenerProductos();
      } else {
        alert("Error al eliminar producto");
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Panel de Administración</h2>

      <div>
        <h3>Agregar producto</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <button onClick={handleAgregar}>Agregar</button>
      </div>

      <div>
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
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.nombre}</td>
                <td>{prod.precio}</td>
                <td>
                  <button onClick={() => handleEliminar(prod.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminPanel;
