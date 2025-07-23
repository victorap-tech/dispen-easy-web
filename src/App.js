import React, { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import Logo from './assets/logo-dispen-easy.svg';
import './App.css';

const API_URL = 'https://web-production-d4c6.up.railway.app/productos';

function App() {
  const [productos, setProductos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [nuevoLinkPago, setNuevoLinkPago] = useState('');
  const [qrOpen, setQROpen] = useState(false);
  const [qrValue, setQRValue] = useState('');
  const [qrProduct, setQRProduct] = useState('');

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      alert('No se pudo conectar al backend.');
    }
  };

  const handleAgregar = async () => {
    if (!nuevoNombre || !nuevoPrecio || !nuevoLinkPago) {
      alert('Completa todos los campos');
      return;
    }
    const nuevo = {
      nombre: nuevoNombre,
      precio: parseFloat(nuevoPrecio),
      link_pago: nuevoLinkPago,
    };
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevo),
      });
      if (response.ok) {
        setNuevoNombre('');
        setNuevoPrecio('');
        setNuevoLinkPago('');
        fetchProductos();
      }
    } catch (error) {
      alert('Error agregando producto');
    }
  };

  const handleBorrar = async (id) => {
    if (!window.confirm('¿Seguro que deseas borrar este producto?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchProductos();
    } catch (error) {
      alert('Error borrando producto');
    }
  };

  const handleVerQR = (link, nombre) => {
    setQRValue(link);
    setQRProduct(nombre);
    setQROpen(true);
  };

  const handlePrintQR = () => {
    const qrElement = document.getElementById('qr-to-print');
    const win = window.open('', 'Print QR', 'height=400,width=350');
    win.document.write(`
      <html>
        <head>
          <title>Imprimir QR</title>
          <style>
            body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: Arial, sans-serif;}
            .qr-label { margin-top: 16px; font-size: 18px; font-weight: bold;}
          </style>
        </head>
        <body>
          ${qrElement.outerHTML}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  return (
    <div className="App">
      {/* Modal QR */}
      {qrOpen && (
        <div className="modal">
          <div className="modal-content">
            <div id="qr-to-print" style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
              <QRCodeCanvas value={qrValue} size={220} />
              <div style={{marginTop:12, fontWeight:"bold", fontSize:18}}>{qrProduct}</div>
              <div style={{marginTop:6, fontSize:16}}>Escaneá y pagá aquí</div>
            </div>
            <div style={{display:"flex", gap:"10px", justifyContent:"center", margin:"14px 0 0 0"}}>
              <button className="btn" onClick={handlePrintQR}>Imprimir</button>
              <button className="btn-delete" onClick={() => setQROpen(false)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="main-card">
        <img src={Logo} alt="Logo" className="main-logo" />
        <h1>Dispen-Easy Web</h1>
        <h2>Productos conectados al backend</h2>
        <div className="input-row">
          <input
            type="text"
            placeholder="Nuevo producto"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoPrecio}
            onChange={(e) => setNuevoPrecio(e.target.value)}
          />
          <input
            type="text"
            placeholder="Link de pago"
            value={nuevoLinkPago}
            onChange={(e) => setNuevoLinkPago(e.target.value)}
          />
          <button className="btn" onClick={handleAgregar}>Agregar</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio ($)</th>
              <th>Ver QR</th>
              <th>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.precio}</td>
                <td>
                  <button className="btn" onClick={() => handleVerQR(prod.link_pago, prod.nombre)}>
                    Ver QR
                  </button>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => handleBorrar(prod.id)}>
                    Borrar
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

export default App;
