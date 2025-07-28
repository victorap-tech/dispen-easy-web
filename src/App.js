// src/App.js (o un archivo de servicio como src/api.js)

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

console.log("URL del Backend configurada:", API_BASE_URL); // Verifica que se cargue correctamente

// Función para obtener productos
async function getProductos() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/productos`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return []; // Retorna un array vacío en caso de error
  }
}

// Función para generar un QR de pago
async function generarQR(productoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generar_qr/${productoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data; // Contendrá qr_data y id_pago_mp
  } catch (error) {
    console.error("Error al generar QR:", error);
    throw error; // Propaga el error para manejarlo en el componente
  }
}

// En un componente React (por ejemplo, App.js)

import React, { useEffect, useState } from 'react';

function App() {
  const [productos, setProductos] = useState([]);
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductos() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductos();
        setProductos(data);
      } catch (err) {
        setError("No se pudieron cargar los productos. " + err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  const handleGenerarQR = async (productoId) => {
    setLoading(true);
    setError(null);
    try {
      const data = await generarQR(productoId);
      setQrData(data.qr_data); // Almacena la URL del QR
      // Aquí puedes añadir lógica para mostrar un modal con el QR o redirigir
      alert("QR generado! Revisa la consola para el link.");
      console.log("QR Data:", data.qr_data);
      console.log("ID de pago MP:", data.id_pago_mp);
    } catch (err) {
      setError("Error al generar el QR: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Dispen-Easy Admin</h1>
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <h2>Productos Disponibles</h2>
      {productos.length > 0 ? (
        <ul>
          {productos.map(producto => (
            <li key={producto.id}>
              {producto.nombre} - {producto.cantidad_ml}ml - ${producto.precio}
              <button onClick={() => handleGenerarQR(producto.id)} disabled={loading}>
                Generar QR
              </button>
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No hay productos disponibles.</p>
      )}

      {qrData && (
        <div>
          <h3>Escanea para pagar:</h3>
          <p>URL del QR: <a href={qrData} target="_blank" rel="noopener noreferrer">{qrData}</a></p>
          {/* Aquí podrías usar una librería como qrcode.react para mostrar el QR */}
          {/* <QRCode value={qrData} size={256} level="H" /> */}
        </div>
      )}
    </div>
  );
}

export default App;