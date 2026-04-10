// OBTENER USUARIO
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'index.html';
}

// OBTENER ID DEL TICKET
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

console.log("ID ADMIN:", id);

// CONTENEDOR
const contenedor = document.querySelector('.div-verConv-left');

let quill;

// ==========================
// MARCAR COMO ABIERTO 🔥
// ==========================
async function marcarComoAbierto() {
    try {
        await fetch(`http://localhost:3000/tickets/${id}/abrir`, {
            method: 'PUT'
        });
    } catch (error) {
        console.error(error);
    }
}

// ==========================
// CARGAR TODO
// ==========================
async function cargarTodo() {
    await marcarComoAbierto(); // 👈 NUEVO
    await cargarTicket();
    await cargarComentarios();
}

// ==========================
// TRAER TICKET
// ==========================
async function cargarTicket() {
    try {
        const res = await fetch(`http://localhost:3000/ticket/${id}`);
        const ticket = await res.json();

        console.log("TICKET:", ticket);

        contenedor.innerHTML = `
            <div class="ticket-detalle">
                <h2>${ticket.tema}</h2>
                <p><strong>Departamento:</strong> ${ticket.departamento}</p>
                <p><strong>Prioridad:</strong> ${ticket.prioridad}</p>

                <div class="descripcion">
                    ${ticket.descripcion}
                </div>
            </div>

            <div id="chat-contenedor"></div>

            <h3>Responder</h3>
            <div id="editor-container"></div>
            <button id="btn-enviar">Enviar</button>
        `;

        iniciarEditor();

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p>Error al cargar ticket</p>';
    }
}

// ==========================
// TRAER COMENTARIOS (ESTILO)
// ==========================
async function cargarComentarios() {
    try {
        const res = await fetch(`http://localhost:3000/comentarios/${id}`);
        const comentarios = await res.json();

        const chat = document.getElementById('chat-contenedor');
        chat.innerHTML = '';

        comentarios.forEach(c => {
            const div = document.createElement('div');
            div.classList.add('mensaje');

            div.innerHTML = `
                <p class="nombre">${c.nombre}</p>
                <div class="mensaje-texto">
                    ${c.comentario}
                </div>
            `;

            chat.appendChild(div);
        });

        chat.scrollTop = chat.scrollHeight;

    } catch (error) {
        console.error(error);
    }
}

// ==========================
// INICIAR EDITOR
// ==========================
function iniciarEditor() {
    quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Responder como administrador...'
    });

    document.getElementById('btn-enviar').addEventListener('click', enviarComentario);
}

// ==========================
// ENVIAR COMENTARIO
// ==========================
async function enviarComentario() {
    const comentario = quill.root.innerHTML;

    if (!comentario.trim()) return;

    try {
        await fetch('http://localhost:3000/comentarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                correo: usuario.correo,
                ticket_id: id,
                comentario: comentario
            })
        });

        quill.root.innerHTML = '';

        cargarComentarios();

    } catch (error) {
        console.error(error);
    }
}

// ==========================
// INICIAR
// ==========================
cargarTodo();