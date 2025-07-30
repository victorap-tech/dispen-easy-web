import React, { useEffect, useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL;

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  const obtenerProductos = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const agregarProducto = async () => {
    try {
      const res = await fetch(`${API_URL}/api/productos`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          precio: parseFloat(precio),
          cantidad_ml: 500  // podés cambiar esto según el producto
        }),
      });

      const data = await res.json();
      if (data.success) {
        obtenerProductos();
        setNombre('');
        setPrecio('');
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
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Panel de Administración</h2>

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
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.nombre}</td>
              <td>{prod.precio}</td>
              <td>
                <button onClick={() => eliminarProducto(prod.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;