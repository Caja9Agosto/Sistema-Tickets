// AQUI JALAMOS EL CORREO DE LA PERSONA REGISTRADA 
const usuario = JSON.parse(localStorage.getItem('usuario'));

if (!usuario) {
    window.location.href = 'index.html';
}

document.getElementById('correo').value = usuario.correo;


// Inicializar el editor
let quill = new Quill('#editor-container', {
    theme: 'snow',
    placeholder: 'Escribe aquí los detalles, inserta links o imágenes...',
    modules: {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{ 'color': [] }, { 'background': [] }],
            ['link', 'image'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ]
    }
});

// SUBMIT CORREGIDO (YA NO RECARGA LA PAGINA)
let form = document.getElementById('form-ticket');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let descripcionInput = document.querySelector('#descripcion');
    descripcionInput.value = quill.root.innerHTML;

    const data = {
        correo: document.getElementById('correo').value,
        tema: document.getElementById('tema').value,
        departamento: document.getElementById('departamento').value,
        tipo: document.getElementById('tipo_solicitud').value,
        sucursal: document.getElementById('sucursal').value,
        descripcion: descripcionInput.value,
        prioridad: document.getElementById('Prioridad').value
    };

    try {
        const res = await fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        console.log("Respuesta backend:", result);

        if (result.success) {
            alert('Ticket creado correctamente');
            form.reset();
            quill.root.innerHTML = '';
        } else {
            alert(result.message || 'Error al guardar ticket');
        }

    } catch (error) {
        console.error(error);
        alert('Error de conexión con el servidor');
    }
});