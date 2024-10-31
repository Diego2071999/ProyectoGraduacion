$(document).ready(function() {
    // Obtener el ID del pedido de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('id');
    
    if (!pedidoId) {
        alert('No se especificó un ID de pedido');
        return;
    }

    // URLs de las APIs
    const urls = {
        pedido: `http://localhost:4000/datos/pedido/${pedidoId}`,
        recetas: 'http://localhost:4000/datos/recetas',
        detalle: 'http://localhost:4000/datos/detalle',
        pacientes: 'http://localhost:4000/datos/paci'
    };

    // Cargar todos los datos necesarios
    Promise.all([
        fetch(urls.pedido),
        fetch(urls.recetas),
        fetch(urls.detalle),
        fetch(urls.pacientes)
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([pedidoData, recetasData, detalleData, pacientesData]) => {
        // Encontrar la receta correspondiente
        const receta = recetasData.find(r => r.id === pedidoData.recetas?.id);
        const paciente = receta?.paciente;
        const medicamento = detalleData.find(d => 
            d.medicamento.id === pedidoData.detallePedido?.MEDICAMENTO_id
        )?.medicamento;
        const pacienteFactura = pacientesData.find(p => p.id === paciente?.id)?.Factura;

        // Limpiar la tabla existente
        $('#tablaPedidos tbody').empty();

         // Cargar el estado de entrega desde localStorage
         const entregaStatus = localStorage.getItem(`pedido_${pedidoId}`) || (pedidoData.entregado ? 'Entregado' : 'No entregado');

        // Crear la fila con todos los datos
        const row = `
            <tr>
                <td>${pedidoData.id}</td>
                <td>${pedidoData.fecha}</td>
                <td>${paciente ? `${paciente.nombre} ${paciente.apellido}` : 'No disponible'}</td>
                <td>${pedidoData.detallePedido?.cantidad || 'No especificada'}</td>
                <td>${medicamento ? medicamento.descripcion : 'No disponible'}</td>
                <td>${paciente ? paciente.direccion || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.telefono || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.email || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.edad || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.nombre_encargado || 'No disponible' : 'No disponible'}</td>
                <td>${pacienteFactura ? pacienteFactura.nit || 'No disponible' : 'No disponible'}</td>
                <td>${pacienteFactura ? pacienteFactura.nomfac || 'No disponible' : 'No disponible'}</td>
                <td class="entrega" style="cursor: pointer;" onclick="toggleEntrega(this)">${entregaStatus}</td> <!-- Nueva celda para entrega -->
            </tr>
        `;

        // Agregar la fila a la tabla
        $('#tablaPedidos tbody').append(row);

        // Inicializar DataTable con configuraciones específicas
        if (!$.fn.DataTable.isDataTable('#tablaPedidos')) {
            $('#tablaPedidos').DataTable({
                "language": {
                    "search": "Buscar paciente:",
                    "zeroRecords": "No se encontraron resultados",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
                    "infoEmpty": "Mostrando 0 a 0 de 0 registros",
                    "infoFiltered": "(filtrado de _MAX_ registros totales)"
                },
                "ordering": false, // Desactivar el ordenamiento ya que solo hay una fila
                "paging": false,   // Desactivar la paginación
                "searching": false // Desactivar la búsqueda
            });
        }

        // Actualizar el título con información del pedido
        $('h2').text(`Detalle del Pedido #${pedidoData.id}`);

        // Agregar botón para volver
        if (!$('.back-button').length) {
            $('.new-order-button').before(`
                <button class="new-order-button" onclick="window.history.back()" style="margin-right: 10px;">
                    Volver a Pedidos
                </button>
            `);
        }
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        $('#errorMessage').html(`
            <div style="color: red; padding: 10px; margin-bottom: 10px; text-align: center;">
                Error al cargar los datos del pedido. Por favor, intente nuevamente.
            </div>
        `);
    });
});
function toggleEntrega(cell) {
    const currentStatus = cell.innerText; // Obtener el estado actual
    const pedidoId = new URLSearchParams(window.location.search).get('id'); // Obtener el ID del pedido

    // Verificar si el pedido ya está entregado
    if (currentStatus === 'Entregado') {
        alert('Este pedido ya ha sido marcado como entregado y no puede ser cambiado.');
        return; // Salir de la función para evitar cambios
    }

    // Cambiar el estado a entregado
    if (currentStatus === 'No entregado') {
        cell.innerText = 'Entregado'; // Cambiar a entregado
        cell.style.cursor = 'default'; // Cambiar el cursor a default
        cell.onclick = null; // Deshabilitar el evento de clic

        // Guardar el estado en localStorage
        localStorage.setItem(`pedido_${pedidoId}`, 'Entregado');
    }
}


// Función para el botón de nuevo pedido
function createNewOrder() {
    // Implementa la lógica para crear un nuevo pedido
    alert('Funcionalidad de nuevo pedido en desarrollo');
}