const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const { guardarLinea, obtenerLineas } = require("./db");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.on("pedir_lineas", async () => {
    const lineas = await obtenerLineas();
    lineas.forEach((linea) => {
      socket.emit("linea", linea);
    });
  });

  socket.on("nueva_linea", async (data) => {
    await guardarLinea(data);
    io.emit("linea", data);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Servidor escuchando en puerto", PORT);
});