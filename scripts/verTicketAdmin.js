const contenedor = document.querySelector('.div-verTick-left');
const info = document.querySelector('#info-usuario');

//  OBTENER USUARIO (para nombre)
const usuario = JSON.parse(localStorage.getItem('usuario'));

async function cargarTicketsAdmin() {
    try {
        const res = await fetch('http://localhost:3000/tickets');
        const tickets = await res.json();

        contenedor.innerHTML = '';

        //  INFO LADO DERECHO (ADMIN)
        info.innerHTML = `
            <div style="padding:15px;">
                <h3>Hola ${usuario.nombre}</h3>
                <p>Tienes <strong>${tickets.length}</strong> ticket's por resolver!!</p>
                <p>Excelente día Admin!</p>
            </div>
        `;

        tickets.forEach(ticket => {
            const div = document.createElement('div');
            div.classList.add('ticket-card');

            let color = '';

            switch (ticket.prioridad) {
                case 'urgente': color = 'red'; break;
                case 'alto': color = 'orange'; break;
                case 'medio': color = 'gold'; break;
                case 'bajo': color = 'green'; break;
                default: color = 'gray';
            }

            div.style.borderLeft = `10px solid ${color}`;
            div.style.padding = '12px';
            div.style.marginBottom = '12px';
            div.style.background = '#fff';
            div.style.borderRadius = '8px';
            div.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            div.style.cursor = 'pointer';

            div.innerHTML = `
                <p><strong>${ticket.nombre}</strong></p>
                <p>${ticket.tema}</p>
                <p>Depto: ${ticket.departamento}</p>
                <p><strong>Prioridad:</strong> ${ticket.prioridad}</p>

                <button class="btn-eliminar">Eliminar</button>
            `;

            //  ABRIR CHAT
            div.addEventListener('click', () => {
                window.location.href = `chatAdmin.html?id=${ticket.id}`;
            });

            // ELIMINAR
            const btnEliminar = div.querySelector('.btn-eliminar');

            btnEliminar.addEventListener('click', async (e) => {
                e.stopPropagation();

                const confirmar = confirm('¿Eliminar ticket?');
                if (!confirmar) return;

                try {
                    await fetch(`http://localhost:3000/tickets/${ticket.id}`, {
                        method: 'DELETE'
                    });

                    div.remove();

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