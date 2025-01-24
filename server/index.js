const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

app.use(cors());
app.use(express.json());


app.get('/api/personas', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM personas');
    res.json(rows);
  } catch (err) {
    console.error('Error retrieving data:', err.message);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
});


app.post('/api/personas', async (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, numeroContacto, email } = req.body;
  try {
    const nuevoPersona = await pool.query(
      'INSERT INTO personas ("nombre", "apellidoPaterno", "apellidoMaterno", "fechaNacimiento", "numeroContacto", "email") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, numeroContacto, email]
    );
    res.json(nuevoPersona.rows[0]);
  } catch (err) {
    console.error('Error inserting data:', err.message);
    res.status(500).json({ error: 'Failed to insert data', details: err.message });
  }
});


app.delete('/api/personas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM personas WHERE "ID" = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json({ message: 'Persona eliminada exitosamente', persona: result.rows[0] });
  } catch (err) {
    console.error('Error deleting data:', err.message);
    res.status(500).json({ error: 'Failed to delete data', details: err.message });
  }
});


app.put('/api/personas/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, numeroContacto, email } = req.body;
  try {
    const result = await pool.query(
      `UPDATE personas
       SET "nombre" = $1, "apellidoPaterno" = $2, "apellidoMaterno" = $3,
           "fechaNacimiento" = $4, "numeroContacto" = $5, "email" = $6
       WHERE "ID" = $7
       RETURNING *`,
      [nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, numeroContacto, email, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Persona no encontrada' });
    }
    res.json({ message: 'Persona actualizada exitosamente', persona: result.rows[0] });
  } catch (err) {
    console.error('Error updating data:', err.message);
    res.status(500).json({ error: 'Failed to update data', details: err.message });
  }
});


app.get('/api/test', (req, res) => {
  res.status(200).send('El servidor está funcionando correctamente');
});


app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
