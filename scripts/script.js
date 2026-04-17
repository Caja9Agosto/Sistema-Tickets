// ==========================
// ELEMENTOS
// ==========================
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
// REGISTRO
// ==========================
formRegistro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombreRegistro').value.trim();
    const correo = document.getElementById('correoRegistro').value.trim();
    const pass = document.getElementById('passRegistro').value;
    const confirm = document.getElementById('passConfirm').value;

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                correo,
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
        console.error("ERROR REGISTRO:", error);
        alert('Error al conectar con el servidor');
    }
});

// ==========================
// LOGIN
// ==========================
formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const correo = document.getElementById('correoLogin').value.trim();
    const password = document.getElementById('passLogin').value;

    try {
        const res = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo,
                password
            })
        });

        const data = await res.json();
        console.log("Respuesta login:", data);

        if (!data.success) {
            alert(data.message || 'Credenciales incorrectas');
            return;
        }

        alert('Login correcto');

        localStorage.setItem('usuario', JSON.stringify(data.user));

        // Redirección por rol
        const rol = data.user.rol;

        if (rol === 'software' || rol === 'hardware') {
            window.location.href = 'dashboardAdmin.html';
        } else {
            window.location.href = 'dashboard.html';
        }

    } catch (error) {
        console.error("ERROR LOGIN:", error);
        alert('Error al conectar con el servidor');
    }
});