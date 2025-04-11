const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

async function guardarLinea(linea) {
  const [r] = await pool.query(
    "INSERT INTO lineas (id, color, geojson) VALUES (?, ?, ?)",
    [linea.id, linea.color, JSON.stringify(linea.geojson)]
  );
  return r;
}

async function obtenerLineas() {
  const [rows] = await pool.query("SELECT * FROM lineas");
  return rows.map(row => ({
    id: row.id,
    color: row.color,
    geojson: JSON.parse(row.geojson)
  }));
}

module.exports = { guardarLinea, obtenerLineas };