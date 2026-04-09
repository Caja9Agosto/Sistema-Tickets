// ==========================
// OBTENER USUARIO
// ==========================
const usuario = JSON.parse(localStorage.getItem('usuario'));

// ==========================
// PROTEGER DASHBOARD
// ==========================
if (!usuario) {
    window.location.href = 'index.html';
}

// ==========================
// MOSTRAR SALUDO AKI BROU
// ==========================
if (usuario) {
    //Concatenacion con el id 
    const primerNombre = usuario.nombre.split(' ')[0];
    document.getElementById('saludoUsuario').textContent = `Hola, ${primerNombre}`;
}

// ==========================
// BOTÓN SALIR
// ==========================
document.getElementById('btn-salir').addEventListener('click', () => {
    localStorage.removeItem('usuario');
    window.location.href = 'index.html';
});