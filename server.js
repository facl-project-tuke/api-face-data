const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  user: "admin",
  host: "147.232.24.160",
  database: "face_detector_test",
  password: "root",
  port: 5432,
});

// Получение списка всех таблиц
app.get("/tables", async (req, res) => {
  try {
    const query = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
        `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Получение схемы таблицы
app.get("/tables/:tableName", async (req, res) => {
  try {
    const { tableName } = req.params;
    const query = `
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = $1;
        `;
    const result = await pool.query(query, [tableName]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
