import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Logo from './assets/logo-dispen-easy.svg'; // Cambia el path si tu logo está en otro lado
import './App.css';

const API_URL = 'https://web-production-d4c6.up.railway.app/productos';

function App() {
  const [productos, setProductos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevoLinkPago, setNuevoLinkPago] = useState('');
  const [qrOpen, setQROpen] = useState(false);
  const [qrValue, setQRValue] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const resp = await fetch(API_URL);
      const data = await resp.json();
      setProductos(data);
    } catch {
      alert('No se pudo conectar al backend.');
    }
  };

  const agregarProducto = async (e) => {
    e.preventDefault();
    if (!nuevoNombre || !nuevoPrecio) return;
    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nuevoNombre,
          precio: parseFloat(nuevoPrecio),
          link_pago: nuevoLinkPago
        })
      });
      setNuevoNombre('');
      setNuevoPrecio('');
      setNuevoLinkPago('');
      fetchProductos();
    } catch {
      alert('Error al agregar');
    }
  };

  const borrarProducto = async (id) => {
    if (!window.confirm('¿Seguro que quieres borrar este producto?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProductos();
    } catch {
      alert('Error al borrar');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '2rem' }}>
      <div style={{
        maxWidth: 700, margin: 'auto', padding: 40, background: 'white', borderRadius: 16,
        boxShadow: '0 4px 20px rgba(0,0,0,0.10)', textAlign: 'center'
      }}>
        <img src={Logo} alt="Logo" style={{ width: 80, marginBottom: 16 }} />
        <h1 style={{ color: '#2673C3', marginBottom: 10 }}>Dispen-Easy Web</h1>
        <p style={{ color: '#555', marginBottom: 25 }}>Productos conectados al backend</p>
        <form onSubmit={agregarProducto} style={{ display: 'flex', gap: 8, marginBottom: 18, justifyContent: 'center' }}>
          <input
            placeholder="Nuevo producto"
            value={nuevoNombre}
            onChange={e => setNuevoNombre(e.target.value)}
            style={{ flex: 2, padding: 8 }}
          />
          <input
            placeholder="Precio"
            type="number"
            value={nuevoPrecio}
            onChange={e => setNuevoPrecio(e.target.value)}
            style={{ flex: 1, padding: 8 }}
          />
          <input
            placeholder="Link de pago"
            value={nuevoLinkPago}
            onChange={e => setNuevoLinkPago(e.target.value)}
            style={{ flex: 3, padding: 8 }}
          />
          <button type="submit" style={{ padding: '8px 14px', background: '#2673C3', color: 'white', border: 'none', borderRadius: 5 }}>Agregar</button>
        </form>
        <table style={{ width: '100%', marginTop: 18 }}>
          <thead>
            <tr style={{ background: '#2673C3', color: 'white' }}>
              <th style={{ padding: 8 }}>Producto</th>
              <th style={{ padding: 8 }}>Precio ($)</th>
              <th style={{ padding: 8 }}>Ver QR</th>
              <th style={{ padding: 8 }}>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 8 }}>{p.nombre}</td>
                <td style={{ padding: 8 }}>{p.precio}</td>
                <td style={{ padding: 8 }}>
                  {p.link_pago &&
                    <button
                      onClick={() => { setQROpen(true); setQRValue(p.link_pago); }}
                      style={{ background: '#2c8ed6', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px' }}>
                      Ver QR
                    </button>
                  }
                </td>
                <td style={{ padding: 8 }}>
                  <button
                    onClick={() => borrarProducto(p.id)}
                    style={{ background: '#e74c3c', color: 'white', border: 'none', borderRadius: 4, padding: '4px 12px' }}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {qrOpen && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{ background: 'white', padding: 28, borderRadius: 18, textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.20)' }}>
              <QRCodeCanvas value={qrValue} size={250} />
              <p style={{ marginTop: 10 }}>{qrValue}</p>
              <button
                style={{ marginTop: 16, padding: '7px 20px', background: '#2673C3', color: 'white', border: 'none', borderRadius: 5 }}
                onClick={() => setQROpen(false)}>Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;