const bcrypt = require('bcrypt');
const { Pool } = require('pg');

// 🔌 CONEXIÓN BD
const pool = new Pool({
  user: 'admin2',
  host: '192.168.0.209',
  database: 'sistema_tickets',
  password: 'p0s31d0n9',
  port: 5432,
});

async function crearAdmins() {
  try {
    const hash = await bcrypt.hash('12345678', 10);

    const admins = [
      {
        nombre: 'Alan Soto',
        correo: 'alan.soto@9deagosto.com',
        rol: 'software'
      },
      {
        nombre: 'Araceli Gonzalez',
        correo: 'araceli.gonzalez@9deagosto.com',
        rol: 'software'
      },
      {
        nombre: 'Miguel Lopez',
        correo: 'miguel.lopez@9deagosto.com',
        rol: 'hardware'
      },
      {
        nombre: 'Sergio Ocampo',
        correo: 'sergio.ocampo@9deagosto.com',
        rol: 'hardware'
      },
      {
        nombre: 'Luis Hernandez',
        correo: 'luis.hernandez@9deagosto.com',
        rol: 'hardware'
      }
    ];

    for (const admin of admins) {
      await pool.query(
        `INSERT INTO usuarios (nombre, correo, password, rol)
         VALUES ($1, $2, $3, $4)`,
        [
          admin.nombre,
          admin.correo,
          hash,
          admin.rol
        ]
      );
    }

    console.log('✔ Todos los admins fueron creados correctamente');

  } catch (error) {
    console.error('❌ Error creando admins:', error);
  } finally {
    process.exit();
  }
}

crearAdmins();
