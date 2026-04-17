// OBTENER USUARIO
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'index.html';
}

// CONTENEDORES
const contenedor = document.querySelector('.div-verTick-left');
const info = document.querySelector('.div-verTick-right');

// TRAER TICKETS
async function cargarTickets() {
    try {
        const res = await fetch(`http://localhost:3000/mis-tickets/${usuario.correo}`);
        const tickets = await res.json();

        console.log("Tickets:", tickets);

        contenedor.innerHTML = '';

        //  INFO DEL USUARIO (LADO DERECHO)
        info.innerHTML = `
            <div style="padding:15px;">
                <h4>Hola ${usuario.nombre}</h4>
                <p>Tienes <strong>${tickets.length}</strong> ticket(s)</p>
                <p>¡Excelente día!</p>
            </div>
        `;

        if (tickets.length === 0) {
            contenedor.innerHTML = '<p>No tienes tickets aún</p>';
            return;
        }

        tickets.forEach(ticket => {
            const div = document.createElement('div');
            div.classList.add('ticket-card');

            div.innerHTML = `
                <p class="ticket-tema">${ticket.tema}</p>
                <p><strong>Estado:</strong> ${ticket.estado}</p>
            `;

            // CLICK PARA IR AL CHAT
            div.addEventListener('click', () => {
                window.location.href = `chat.html?id=${ticket.id}`;
            });

            contenedor.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p>Error al cargar tickets</p>';
    }
}

// CARGAR AL INICIAR
cargarTickets();