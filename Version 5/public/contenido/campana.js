$(document).ready(function () {
    var url = 'http://localhost:4000/datos/recetas';

    var table = $('#recetaTable').DataTable({
        "ajax": {
            "url": url,
            "dataSrc": function (data) {
                console.log('Datos cargados desde la API:', data); // Verifica que los datos sean correctos
                return data;
            }
        },
        "columns": [
            {
                "data": "paciente",
                "title": "Paciente",
                "render": function (data, type, row) {
                    return `
                    <strong>Nombre:</strong> ${data.nombre} ${data.apellido}<br>
                    <strong>Edad:</strong> ${data.edad} años<br>
                    <strong>Encargado:</strong> ${data.nombre_encargado}<br>
                    <strong>NIT:</strong> ${data.nit}<br>
                    <strong>Nombre Factura:</strong> ${data.nomfac}<br>
                    <strong>Email:</strong> ${data.email}<br>
                    <strong>Teléfonos:</strong> ${data.telefono} / ${data.telefono2}<br>
                    `;
                }
            },
            {
                "data": "medicamento"
                , // Cambiar a 'medicamento' en lugar de 'medicamento'
                "title": "Medicamento",
                "render": function (data, type, row) {
                    return `
            <strong>Código:</strong> ${data.codigo}<br>
            <strong>Descripción:</strong> ${data.descripcion}
        `;
                }
            },
            {
                "data": "detalleReceta",
                // Cambiar a 'detalleReceta' en lugar de 'recetas'
                "title": "Detalles de Receta",
                "render": function (data, type, row) {
                    return `
                     <strong>Dosis diaria:</strong> ${data.dosis_diaria}<br>
                     <strong>Tiempo consumo:</strong> ${data.tiempo_consumo} días<br>
                     <strong>Inicio:</strong> ${new Date(data.fecha_inicio).toLocaleDateString()}<br>
                     <strong>Fin:</strong> ${new Date(data.fecha_fin).toLocaleDateString()}
                     `;
                }
            },
            {
                "data": null,
                "render": function (data, type, row) {
                    return `
                        <button class="update-btn" onclick="abrirReabastecerModal(${data.id}, ${row.paciente.id}, ${row.medicamento.id})">Reabastecer</button>
                    `;
                }
            }
        ],
        "language": {
            "search": "Buscar:",
            "lengthMenu": "Mostrar _MENU_ registros por página",
            "zeroRecords": "No se encontraron resultados",
            "info": "Mostrando página _PAGE_ de _PAGES_",
            "infoEmpty": "No hay registros disponibles",
            "infoFiltered": "(filtrado de _MAX_ registros totales)"
        },
        "responsive": true,
        "orderCellsTop": true,
        "fixedHeader": true,
        "pageLength": 10,
        "dom": '<"top"lf>rt<"bottom"ip><"clear">',
        "createdRow": function (row, data, dataIndex) {
            $(row).attr('id', `row-${data.id}`).addClass('align-middle'); // Asegúrate de que 'data.id' sea único.
        },
        // Ordenación predeterminada solo por la columna de fecha
        "order": [[2, 'asc']], // Cambia el índice 2 si "recetas" no es la columna correcta
        "rowId": 'id' // Asegúrate de que el ID de cada fila sea único

        // "paging": false,           // Eliminar paginación
        // "info": false              // Ocultar la información de "Mostrando X de Y entradas"
    });

    // Mover el buscador a la ubicación personalizada
    $('#customSearchContainer').append($('.dataTables_filter'));

    // Añadir evento para buscar en tiempo real
    $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
    });

    // Ordenar fechas para que la fecha actual sea la primera
    function ordenarPorFechaActual() {
        const fechaActual = new Date().toLocaleDateString(); // Obtiene la fecha actual
        table.rows().every(function (rowIdx, tableLoop, rowLoop) {
            const fechaInicio = new Date(this.data().detalleReceta.fecha_inicio).toLocaleDateString();
            this.data().detalleReceta.fecha_inicio = (fechaInicio === fechaActual) ? new Date().getTime() : new Date(this.data().detalleReceta.fecha_inicio).getTime();
        });
        table.draw();
    }

    // Llama a la función para ordenar al cargar la tabla
    ordenarPorFechaActual();
});

function seleccionarFila(fila) {
    // Asumimos que los IDs están en los inputs ocultos dentro de la fila
    const medicamentoId = fila.querySelector('input[type="hidden"]:nth-of-type(1)').value; // ID del medicamento
    const pacienteId = fila.querySelector('input[type="hidden"]:nth-of-type(2)').value; // ID del paciente
    const recetaId = fila.querySelector('input[type="hidden"]:nth-of-type(3)').value; // ID de la receta

    // Asignar los valores a los campos ocultos
    document.getElementById('medicamentoId').value = medicamentoId;
    document.getElementById('pacienteId').value = pacienteId;
    document.getElementById('recetaId').value = recetaId;

    // Opcional: abrir el modal
    abrirModal();
}

async function obtenerCantidadDetallePedido(recetaId, medicamentoId) {
    try {
        const response = await fetch(`http://localhost:4000/datos/detalle?medicamentoId=${medicamentoId}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const cantidad = data[0].cantidad;
            document.getElementById('cantidadInput').value = cantidad;
        } else {
            console.log('No se encontró la cantidad del detalle de pedido.');
            document.getElementById('cantidadInput').value = '';
        }
    } catch (error) {
        console.error('Error al obtener la cantidad:', error);
        document.getElementById('cantidadInput').value = '';
    }
}

function abrirReabastecerModal(id) {
    document.getElementById('ReabastecerModal').style.display = 'block'; // Muestra el modal
    var table = $('#recetaTable').DataTable();
    var data = table.row(`#row-${id}`).data();

    if (data) {
        const recetaId = id;
        const medicamentoId = data.medicamento.id;
        const pacienteId = data.paciente.id;

        // Llama a la función para obtener la cantidad del detalle de pedido
        obtenerCantidadDetallePedido(recetaId, medicamentoId);

        // Calcula la fecha de inicio (fecha actual)
        const fechaInicio = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD

        // Rellena el contenido del modal con los valores actuales y los campos de entrada para edición
        document.getElementById('modalContent').innerHTML = `
            <input type="hidden" id="medicamentoId" value="${medicamentoId}" />
            <input type="hidden" id="pacienteId" value="${pacienteId}" />

            <p><strong>Paciente:</strong> ${data.paciente.nombre} ${data.paciente.apellido}</p>
            <p><strong>Encargado:</strong> ${data.paciente.nombre_encargado}</p>
            <p><strong>NIT:</strong> ${data.paciente.nit}</p>
            <p><strong>Nombre Factura:</strong> ${data.paciente.nomfac}</p>
            <hr>
            <p><strong>Medicamento Código:</strong> ${data.medicamento.codigo}</p>
            <p><strong>Descripción:</strong> ${data.medicamento.descripcion}</p>
            <hr>
            <label for="cantidadInput"><strong>Cantidad:</strong></label>
            <input type="number" id="cantidadInput" placeholder="Cantidad actual..." />
            <hr>
            <label for="dosisDiariaInput"><strong>Dosis diaria:</strong></label>
            <input type="number" id="dosisDiariaInput" value="${data.detalleReceta.dosis_diaria}" placeholder="Dosis diaria..." />
            <label for="tiempoConsumoInput"><strong>Tiempo consumo (días):</strong></label>
            <input type="number" id="tiempoConsumoInput" value="${data.detalleReceta.tiempo_consumo}" placeholder="Tiempo de consumo..." />
            <hr>
            <label for="fechaInicioInput"><strong>Fecha inicio:</strong></label>
            <input type="date" id="fechaInicioInput" value="${fechaInicio}" readonly />
            <hr>
            <label for="fechaFinInput"><strong>Fecha fin (editable):</strong></label>
            <input type="date" id="fechaFinInput" />
            <hr>
        `;

        // Calcular fecha de fin estimada al cambiar la cantidad o dosis
        calcularFechaFin();

        // Agregar eventos para recalcular la fecha fin
        document.getElementById('cantidadInput').addEventListener('input', calcularFechaFin);
        document.getElementById('dosisDiariaInput').addEventListener('input', calcularFechaFin);
        document.getElementById('tiempoConsumoInput').addEventListener('input', calcularFechaFin);

        document.getElementById('ReabastecerModal').style.display = 'block';
    } else {
        alert('No se encontraron datos para la receta seleccionada.');
    }
}

function calcularFechaFin() {
    const cantidad = parseInt(document.getElementById('cantidadInput').value) || 0;
    const dosisDiaria = parseInt(document.getElementById('dosisDiariaInput').value) || 0;
    const tiempoConsumo = parseInt(document.getElementById('tiempoConsumoInput').value) || 0;

    // Obtener la fecha de inicio desde el input del modal
    const fechaInicioInput = document.getElementById('fechaInicioInput').value;
    const fechaInicio = new Date(fechaInicioInput); // Convierte a objeto Date

    // Verifica que la fecha de inicio sea válida
    if (isNaN(fechaInicio)) {
        console.error('Fecha de inicio no válida');
        return;
    }

    // Calcula la cantidad de días necesarios para consumir el medicamento
    let diasNecesarios = 0;

    if (dosisDiaria > 0) {
        diasNecesarios = Math.ceil(cantidad / dosisDiaria); // Redondea hacia arriba
    }

    // Calcula la fecha de fin sumando los días necesarios y el tiempo de consumo
    const fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + diasNecesarios + tiempoConsumo); // Sumar días

    // Actualiza la fecha de fin en el campo de entrada
    document.getElementById('fechaFinInput').value = fechaFin.toISOString().split('T')[0];
}


async function guardarCambios() {
    const cantidad = parseInt(document.getElementById('cantidadInput').value) || 0;
    const dosisDiaria = parseInt(document.getElementById('dosisDiariaInput').value) || 0;
    const tiempoConsumo = parseInt(document.getElementById('tiempoConsumoInput').value) || 0;
    const fechaInicio = document.getElementById('fechaInicioInput').value;
    const fechaFin = document.getElementById('fechaFinInput').value;

    // IDs necesarios
    const medicamentoId = document.getElementById('medicamentoId').value; // ID del medicamento
    const pacienteId = document.getElementById('pacienteId').value; // ID del paciente

    try {
        // Guardar en detallePedido
        const detallePedidoResponse = await fetch('http://localhost:4000/datos/detalle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cantidad: cantidad,
                MEDICAMENTO_id: medicamentoId, // Asegúrate de que esto sea correcto
            }),
        });

        const detallePedidoData = await detallePedidoResponse.json();
        const detallePedidoId = detallePedidoData.id; // Asegúrate de que este ID está en la respuesta

        // Guardar en detalleReceta
        const detalleRecetaResponse = await fetch('http://localhost:4000/datos/receta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dosis_diaria: dosisDiaria,
                tiempo_consumo: tiempoConsumo,
                fecha_inicio: fechaInicio,
                fecha_fin: fechaFin,
            }),
        });

        const detalleRecetaData = await detalleRecetaResponse.json();
        const detalleRecetaId = detalleRecetaData.id; // Asegúrate de que este ID está en la respuesta

        if (!detalleRecetaId) {
            throw new Error("No se pudo obtener el ID de detalleReceta");
        }

        // Guardar en receta
        const recetaResponse = await fetch('http://localhost:4000/datos/recetas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                PACIENTE_cod: pacienteId, // Usar el ID del paciente correcto
                MEDICAMENTO_id: medicamentoId, // Usar el ID del medicamento correcto
                DETALLE_RECETA_id: detalleRecetaId, // Relaciona con el ID de detalleReceta
                //DETALLE_PEDIDO_id: detallePedidoId // Relaciona con el ID de detallePedido
            }),
        });

        // Aquí puedes manejar la respuesta de la creación de receta
        const recetaData = await recetaResponse.json();
        const RecetaId = recetaData.id; // Asegúrate de que este ID está en la respuesta
        console.log("Receta guardada:", recetaData);
        
        if (!RecetaId) {
            throw new Error("No se pudo obtener el ID de Receta");
        }

        // Guardar en receta
        const pedidoResponse = await fetch('http://localhost:4000/datos/pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fecha: new Date().toISOString(), // Fecha actual en formato ISO
                DETALLE_PEDIDO_id: detallePedidoId, // Relaciona con el ID de detallePedido
                RECETA_id: RecetaId // Relaciona con el ID de detalleReceta
                
            }),
        });
        const pedidoData = await pedidoResponse.json();
        console.log("Receta guardada:", pedidoData);

        // Cerrar el modal
        document.getElementById('ReabastecerModal').style.display = 'none';
        alert('Cambios guardados correctamente');
    } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert('Error al guardar los cambios, por favor intenta nuevamente.');
    }
}

function cerrarModal() {
    document.getElementById('ReabastecerModal').style.display = 'none';
}

window.onclick = function (event) {
    var modal = document.getElementById('ReabastecerModal');
    if (event.target == modal) {
        cerrarModal();
    }
}