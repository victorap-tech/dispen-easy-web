import React, { useEffect, useState } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    fetch('https://web-production-d4c6.up.railway.app/productos')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://web-production-d4c6.up.railway.app/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, precio })
    })
      .then(res => res.json())
      .then(prod => {
        setProductos([...productos, prod]);
        setNombre('');
        setPrecio('');
      });
  };

  return (
    <div style={{ padding: 32 }}>
      <h2>Dispen-Easy Web</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del producto" required />
        <input value={precio} type="number" onChange={e => setPrecio(e.target.value)} placeholder="Precio" required />
        <button type="submit">Crear producto</button>
      </form>
      <table border="1" cellPadding={6}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Link de pago</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.nombre}</td>
              <td>${p.precio}</td>
              <td>
                <a href={p.link_pago} target="_blank" rel="noopener noreferrer">Pagar</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
