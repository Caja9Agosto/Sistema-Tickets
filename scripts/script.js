// script.js

const btnRegistro = document.getElementById('btnRegistro');
const btnLogin = document.getElementById('btnLogin');
const formRegistro = document.getElementById('formRegistro');
const formLogin = document.getElementById('formLogin');

// ==========================
// LIMPIAR FORMULARIOS
// ==========================
function limpiarForms() {
    formRegistro.reset();
    formLogin.reset();
}

// ==========================
// CAMBIO DE VISTAS
// ==========================
btnRegistro.addEventListener('click', () => {
    limpiarForms();
    formRegistro.classList.remove('hidden');
    formLogin.classList.add('hidden');
});

btnLogin.addEventListener('click', () => {
    limpiarForms();
    formLogin.classList.remove('hidden');
    formRegistro.classList.add('hidden');
});


// ==========================
// REGISTRO REAL
// ==========================
formRegistro.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombreRegistro').value;
    const correo = document.getElementById('correoRegistro').value;
    const pass = document.getElementById('passRegistro').value;
    const confirm = document.getElementById('passConfirm').value;

    console.log("Nombre capturado:", nombre);

    if (!correo.endsWith('@9deagosto.com')) {
        alert('Solo correos autorizados');
        return;
    }

    if (pass.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    if (pass !== confirm) {
        alert('Las contraseñas no coinciden');
        return;
    }

    try {
        const res = await fetch('http://localhost:3000/registro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                correo: correo,
                password: pass
            })
        });

        const data = await res.json();
        console.log("Respuesta registro:", data);

        if (data.success) {
            alert('Registro exitoso');

            formRegistro.reset();
            btnLogin.click();
        } else {
            alert(data.message || 'Error al registrar');
        }

    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor');
    }
});


// ==========================
// LOGIN REAL
// ==========================
formLogin.addEventListener('submit', async function(e) {
    e.preventDefault();

    const correo = document.getElementById('correoLogin').value;
    const pass = document.getElementById('passLogin').value;

    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: correo,
                password: pass
            })
        });

        const data = await res.json();
        console.log("Respuesta login:", data);

        if (data.success) {
            alert('Login correcto');

            localStorage.setItem('usuario', JSON.stringify(data.user));

            // Redirección según rol
            if (data.user.rol === 'software' || data.user.rol === 'hardware') {
                window.location.href = 'dashboardAdmin.html';
            } else {
                window.location.href = 'dashboard.html';
            }

        } else {
            alert('Credenciales incorrectas');
        }

    } catch (error) {
        console.error(error);
        alert('Error al conectar con el servidor');
    }
});