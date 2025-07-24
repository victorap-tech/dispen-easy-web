import React, { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [paymentLinks, setPaymentLinks] = useState({});

  // Fetch products from the backend
  useEffect(() => {
    axios.get("https://web-production-d4c6c.up.railway.app/products")
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  // Generate payment link for a specific product
  const generatePaymentLink = (productId) => {
    axios.post('https://web-production-d4c6c.up.railway.app/create_payment', { productId })
      .then(response => {
        const { paymentLink, productId } = response.data;
        setPaymentLinks(prevLinks => ({
          ...prevLinks,
          [productId]: paymentLink
        }));
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="App">
      <h1>Dispen-Easy - Productos</h1>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Generar Pago</th>
            <th>QR de Pago</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.nombre}</td>
              <td>${product.precio}</td>
              <td>
                <button onClick={() => generatePaymentLink(product.id)}>
                  Generar Pago
                </button>
              </td>
              <td>
                {paymentLinks[product.id] && (
                  <QRCode value={paymentLinks[product.id]} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
