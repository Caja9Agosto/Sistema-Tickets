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

            // CONTENIDO
            div.innerHTML = `
                <p><strong>${ticket.nombre}</strong></p>
                <p>${ticket.tema}</p>
                <p>Depto: ${ticket.departamento}</p>
                <p><strong>Prioridad:</strong> ${ticket.prioridad}</p>
            `;

            // 👉 CLICK PARA ABRIR (ADMIN)
            div.addEventListener('click', () => {
                window.location.href = `chatAdmin.html?id=${ticket.id}`;
            });

            contenedor.appendChild(div);
        });

    } catch (error) {
        console.error(error);
        contenedor.innerHTML = '<p>Error al cargar tickets</p>';
    }
}

cargarTicketsAdmin();