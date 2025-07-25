<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Dispen-Easy - Link de Pago</title>
</head>
<body>
  <h2>Generar Link de Pago</h2>
  <button onclick="generarLink()">Generar</button>
  <p id="link"></p>

  <script>
    async function generarLink() {
      const body = {
        title: "Producto Dispen-Easy",
        quantity: 1,
        unit_price: 100,
        currency_id: "ARS"
      };

      const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
        method: "POST",
        headers: {
          "Authorization": "Bearer TU_ACCESS_TOKEN_PRODUCCION",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: [body],
          back_urls: {
            success: "https://www.success.com",
            failure: "https://www.failure.com",
            pending: "https://www.pending.com"
          },
          notification_url: "https://TU_DOMINIO/webhook"
        })
      });

      const data = await response.json();
      document.getElementById("link").innerHTML = `<a href="${data.init_point}" target="_blank">Ir al Pago</a>`;
    }
  </script>
</body>
</html>
