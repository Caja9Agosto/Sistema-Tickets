// OBTENER USUARIO
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'index.html';
}

// CONTENEDOR IZQUIERDO
const contenedor = document.querySelector('.div-verTick-left');

// TRAER TICKETS
async function cargarTickets() {
    try {
        const res = await fetch(`http://localhost:3000/mis-tickets/${usuario.correo}`);
        const tickets = await res.json();

        console.log("Tickets:", tickets);

        contenedor.innerHTML = '';

        if (tickets.length === 0) {
            contenedor.innerHTML = '<p>No tienes tickets aún</p>';
            return;
        }

        tickets.forEach(ticket => {
            const div = document.createElement('div');
            div.classList.add('ticket-card');

            div.innerHTML = `<p class="ticket-tema">${ticket.tema}</p>`;

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