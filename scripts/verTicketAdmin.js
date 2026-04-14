const contenedor = document.querySelector('.div-verTick-left');

async function cargarTicketsAdmin() {
    try {
        const res = await fetch('http://localhost:3000/tickets');
        const tickets = await res.json();

        contenedor.innerHTML = '';

        tickets.forEach(ticket => {
            const div = document.createElement('div');
            div.classList.add('ticket-card');

            // 🎨 COLOR POR PRIORIDAD
            let color = '';

            switch (ticket.prioridad) {
                case 'urgente':
                    color = 'red';
                    break;
                case 'alto':
                    color = 'orange';
                    break;
                case 'medio':
                    color = 'gold';
                    break;
                case 'bajo':
                    color = 'green';
                    break;
                default:
                    color = 'gray';
            }

            // 🎨 ESTILOS
            div.style.borderLeft = `10px solid ${color}`;
            div.style.padding = '12px';
            div.style.marginBottom = '12px';
            div.style.background = '#fff';
            div.style.borderRadius = '8px';
            div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            div.style.cursor = 'pointer';

            // CONTENIDO + BOTÓN ELIMINAR
            div.innerHTML = `
                <p><strong>${ticket.nombre}</strong></p>
                <p>${ticket.tema}</p>
                <p>Depto: ${ticket.departamento}</p>
                <p><strong>Prioridad:</strong> ${ticket.prioridad}</p>

                <button class="btn-eliminar">Eliminar</button>
            `;

            // 👉 CLICK PARA ABRIR CHAT
            div.addEventListener('click', () => {
                window.location.href = `chatAdmin.html?id=${ticket.id}`;
            });

            // 👉 BOTÓN ELIMINAR
            const btnEliminar = div.querySelector('.btn-eliminar');

            btnEliminar.addEventListener('click', async (e) => {
                e.stopPropagation(); // 🔥 evita que abra el chat

                const confirmar = confirm('¿Eliminar ticket?');
                if (!confirmar) return;

                try {
                    await fetch(`http://localhost:3000/tickets/${ticket.id}`, {
                        method: 'DELETE'
                    });

                    div.remove(); // elimina visualmente

                } catch (error) {
                    console.error(error);
                }
            });

            contenedor.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p>Error al cargar tickets</p>';
    }
}

cargarTicketsAdmin();