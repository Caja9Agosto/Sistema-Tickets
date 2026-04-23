const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

//  CONEXIÓN BD
const pool = new Pool({
  user: 'admin2',
  host: '192.168.0.209',
  database: 'sistema_tickets',
  password: 'p0s31d0n9',
  port: 5432,
});

// ==========================
// RUTA PRUEBA
// ==========================
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// ==========================
// USUARIOS
// ==========================

// VER USUARIOS
app.get('/usuarios', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.json([]);
  }
});

// ==========================
// LOGIN (CORREGIDO)
// ==========================
app.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (result.rows.length === 0) {
      return res.json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    let valid = false;

    // 🔥 Si ya está en bcrypt
    if (user.password.startsWith('$2')) {
      valid = await bcrypt.compare(password, user.password);
    } 
    // 🔥 usuarios viejos (texto plano)
    else {
      valid = password === user.password;
    }

    if (!valid) {
      return res.json({ success: false, message: 'Credenciales incorrectas' });
    }

    res.json({ success: true, user });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// ==========================
// REGISTRO (CON HASH)
// ==========================
app.post('/registro', async (req, res) => {
  const { nombre, correo, password } = req.body;

  try {
    const existe = await pool.query(
      'SELECT * FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (existe.rows.length > 0) {
      return res.json({ success: false, message: 'Usuario ya existe' });
    }

    const hash = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO usuarios (nombre, correo, password, rol)
       VALUES ($1, $2, $3, 'usuario')`,
      [nombre, correo, hash]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// ==========================
// TICKETS
// ==========================

// CREAR TICKET
app.post('/tickets', async (req, res) => {
  const { correo, tema, departamento, tipo, sucursal, descripcion, prioridad } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (userResult.rows.length === 0) {
      return res.json({ success: false, message: 'Usuario no encontrado' });
    }

    const usuario_id = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO tickets 
      (usuario_id, tema, departamento, tipo_solicitud, sucursal, descripcion, prioridad)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [usuario_id, tema, departamento, tipo, sucursal, descripcion, prioridad]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// OBTENER TODOS LOS TICKETS (ADMIN)
app.get('/tickets', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.*, u.nombre
       FROM tickets t
       JOIN usuarios u ON t.usuario_id = u.id
       ORDER BY t.id DESC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

// MIS TICKETS
app.get('/mis-tickets/:correo', async (req, res) => {
  const { correo } = req.params;

  try {
    const userResult = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (userResult.rows.length === 0) {
      return res.json([]);
    }

    const usuario_id = userResult.rows[0].id;

    const tickets = await pool.query(
      'SELECT * FROM tickets WHERE usuario_id = $1 ORDER BY id DESC',
      [usuario_id]
    );

    res.json(tickets.rows);

  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

// UN SOLO TICKET
app.get('/ticket/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM tickets WHERE id = $1',
      [id]
    );

    res.json(result.rows[0] || {});

  } catch (error) {
    console.error(error);
    res.json({});
  }
});

// ABRIR TICKET
app.put('/tickets/:id/abrir', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      'UPDATE tickets SET estado = $1 WHERE id = $2',
      ['abierto', id]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// ELIMINAR TICKET
app.delete('/tickets/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM comentarios WHERE ticket_id = $1', [id]);
    await pool.query('DELETE FROM tickets WHERE id = $1', [id]);

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// ==========================
// COMENTARIOS
// ==========================

// GUARDAR
app.post('/comentarios', async (req, res) => {
  const { correo, ticket_id, comentario } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT id FROM usuarios WHERE correo = $1',
      [correo]
    );

    if (userResult.rows.length === 0) {
      return res.json({ success: false });
    }

    const usuario_id = userResult.rows[0].id;

    await pool.query(
      `INSERT INTO comentarios (ticket_id, usuario_id, comentario)
       VALUES ($1, $2, $3)`,
      [ticket_id, usuario_id, comentario]
    );

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

// OBTENER
app.get('/comentarios/:ticket_id', async (req, res) => {
  const { ticket_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT c.*, u.nombre
       FROM comentarios c
       JOIN usuarios u ON c.usuario_id = u.id
       WHERE c.ticket_id = $1
       ORDER BY c.id ASC`,
      [ticket_id]
    );

    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.json([]);
  }
});

// ==========================
// SERVER
// ==========================
app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});


//te odio nodejs
