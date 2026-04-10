// OBTENER USUARIO
const usuario = JSON.parse(localStorage.getItem('usuario'));

// OBTENER ID DESDE LA URL
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

console.log("ID del ticket:", id);

// CONTENEDOR
const contenedor = document.querySelector('.div-verConv-left');

let quill;

// ==========================
// TRAER TICKET + PINTAR TODO
// ==========================
async function cargarTicket() {
    try {
        const res = await fetch(`http://localhost:3000/ticket/${id}`);
        const ticket = await res.json();

        contenedor.innerHTML = `
            <div class="ticket-detalle">
                <h2>${ticket.tema}</h2>
                <p><strong>Departamento:</strong> ${ticket.departamento}</p>
                <p><strong>Prioridad:</strong> ${ticket.prioridad}</p>

                <div class="descripcion">
                    ${ticket.descripcion}
                </div>
            </div>

            <!-- CONVERSACIÓN -->
            <div id="chat-contenedor" style="margin-top:20px;"></div>

            <!-- RESPUESTA -->
            <div style="margin-top:20px;">
                <h3>Responder</h3>
                <div id="editor-container"></div>
                <button id="btn-enviar">Enviar</button>
            </div>
        `;

        iniciarEditor();
        cargarComentarios();

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p>Error al cargar ticket</p>';
    }
}

// ==========================
// TRAER COMENTARIOS
// ==========================
async function cargarComentarios() {
    try {
        const res = await fetch(`http://localhost:3000/comentarios/${id}`);
        const comentarios = await res.json();

        const chat = document.getElementById('chat-contenedor');
        if (!chat) return;

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

        // scroll automático
        chat.scrollTop = chat.scrollHeight;

    } catch (error) {
        console.error(error);
    }
}

// ==========================
// INICIAR QUILL
// ==========================
function iniciarEditor() {
    quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Escribe un comentario...'
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                correo: usuario.correo,
                ticket_id: id,
                comentario: comentario
            })
        });

        // limpiar editor
        quill.root.innerHTML = '';

        // recargar conversación
        cargarComentarios();

    } catch (error) {
        console.error(error);
    }
}

// ==========================
// INICIAR
// ==========================
cargarTicket();