const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// Sirve los archivos estáticos de React desde la carpeta build
app.use(express.static(path.join(__dirname, "build")));

// Cualquier otra ruta, devuelve el index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor frontend corriendo en el puerto ${PORT}`);
});