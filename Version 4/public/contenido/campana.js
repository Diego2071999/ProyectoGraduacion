$(document).ready(function() {   
    var url = 'http://localhost:4000/datos/recetas';
    
    var table = $('#productTable').DataTable({            
        "ajax": {
            "url": url,
            "dataSrc": function(data) {
                console.log('Datos cargados desde la API:', data);
                return data;
            }
        },
        "columns": [
            // Paciente Detalles
            {
                "data": "Paciente",
                "title": "Paciente",
                "render": function(data, type, row) {
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
            // Medicamento Detalles
            {
                "data": "medicamento",
                "title": "Medicamento",
                "render": function(data, type, row) {
                    return `
                        <strong>Código:</strong> ${data.codigo}<br>
                        <strong>Descripción:</strong> ${data.descripcion}
                    `;
                }
            },
            // Receta Detalles
            {
                "data": "recetas",
                "title": "Detalles de Receta",
                "render": function(data, type, row) {
                    return `
                        <strong>Dosis diaria:</strong> ${data.dosis_diaria}<br>
                        <strong>Tiempo consumo:</strong> ${data.tiempo_consumo} días<br>
                        <strong>Inicio:</strong> ${new Date(data.fecha_inicio).toLocaleDateString()}<br>
                        <strong>Fin:</strong> ${new Date(data.fecha_fin).toLocaleDateString()}
                    `;
                }
            },
            // Actions Column
            {
                "data": null,
                "title": "Acciones",
                "className": "text-center",
                "render": function(data, type, row) {
                    return `
                        <button class="view-btn btn-sm m-1" onclick="abrirModal(
                            '${row.Paciente.nombre}', 
                            '${row.medicamento.nombre}', 
                            '${row.recetas.dosis_diaria}',
                            '${row.recetas.tiempo_consumo}',
                            '${row.recetas.fecha_fin}',
                            ${row.recetas.id}, // Receta ID
                            ${row.medicamento.id}, // Medicamento ID
                            ${row.Paciente.id} // Paciente ID
                        )">
                            Reabastecer
                        </button>
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
        "createdRow": function(row, data, dataIndex) {
            $(row).addClass('align-middle');
        }
    });
    /*console.log('Abriendo modal con los siguientes datos:', {
        paciente: row.Paciente.nombre,
        medicamento: row.medicamento.nombre,
        recetaId: row.recetas.id,
        medicamentoId: row.medicamento.id,
        pacienteId: row.Paciente.id
    });*/

    $('#productTable tbody').on('click', '.btn-reabastecer', function() {
        var data = table.row($(this).parents('tr')).data();
        var pacienteId = data.Paciente.id; // Asegúrate de que el ID esté en el objeto Paciente
        var medicamentoId = data.medicamento.id; // Asegúrate de que el ID esté en el objeto medicamento
        var recetaId = data.recetas.id; // Asegúrate de que el ID esté en el objeto recetas
        
        console.log('Datos antes de abrir el modal:', {
            pacienteId: pacienteId,
            medicamentoId: medicamentoId,
            recetaId: recetaId
        });

        abrirModal(data.Paciente, data.medicamento, recetaId, data.recetas.tiempo_consumo, data.recetas.fecha_fin, 1, medicamentoId, pacienteId);
    });
    

    $('#confirmar-reabastecer').off('click').on('click', async function() {
        try {
            // Obtener los datos del modal
            let receta = $('#modal-receta').val();
            let tiempoConsumo = $('#modal-tiempo-consumo').val();
            let cantidad = $('#modal-cantidad').val();
            let nuevaFechaInicio = $('#modal-fecha-inicio').val(); // Nueva fecha de inicio
            let nuevaFechaFin = $('#modal-fecha-fin').val(); // Nueva fecha de fin
            let medicamentoId = $('#modal-medicamento-id').val(); // ID del medicamento
            console.log('Datos al confirmar:', {
                receta: receta,
                tiempoConsumo: tiempoConsumo,
                cantidad: cantidad,
                nuevaFechaInicio: nuevaFechaInicio,
                nuevaFechaFin: nuevaFechaFin,
                medicamentoId: medicamentoId
            });

    
            const recetaData = {
                dosis_diaria: receta,
                tiempo_consumo: tiempoConsumo,
                fecha_inicio: nuevaFechaInicio,
                fecha_fin: nuevaFechaFin
            };
    
            // Llamar a la función para crear la receta
            const nuevaReceta = await crearDetalleReceta(recetaData);
            if (!nuevaReceta) return;

            // Crear el detalle del pedido
            const nuevoDetalle = await crearDetallePedido(cantidad, medicamentoId);
            if (!nuevoDetalle) return;
    
            // Aquí podrías agregar el código para manejar el pedido
            // const nuevoDetalle = await crearDetalle(detalleData, medicamentoId);
            // await crearPedido(nuevaReceta.id, nuevoDetalle.id);
    
            alert("Receta y Detalle de Pedido creada con éxito.");
            $('#reabastecerModal').css('display', 'none');
    
            // Limpiar campos del modal
            $('#modal-receta').val('');
            $('#modal-tiempo-consumo').val('');
            $('#modal-cantidad').val('');
            $('#modal-fecha-inicio').val('');
            $('#modal-fecha-fin').val('');
            $('#modal-medicamento-id').val('');
    
        } catch (error) {
            console.error('Error durante el proceso:', error);
            alert('Hubo un error al procesar los datos');
        }
    });
});

// Modified sorting function to work with nested data
function ordenarPor(criterio) {
    var table = $('#productTable').DataTable();
    var columnMapping = {
        'paciente': 0,
        'medicamento': 1,
        'receta': 2
    };
    
    if (columnMapping[criterio] !== undefined) {
        table.order([columnMapping[criterio], 'asc']).draw();
    }
}

// Función para obtener los datos del pedido y abrir el modal
async function obtenerDatosYAbrirModal(paciente, medicamento, receta, tiempoConsumo, fechaFin, recetaId) {
    try {
        // Hacer la petición al endpoint de pedido usando el ID de la receta
        const response = await fetch(`http://localhost:4000/datos/pedido/${recetaId}`);
        const pedido = await response.json();

        if (!pedido || !pedido.DETALLE_PEDIDO_id) {
            console.error('No se encontró el detalle del pedido');
            return;
        }

        // Abrimos el modal con los datos
        abrirModal(
            paciente,
            medicamento,
            receta,
            tiempoConsumo,
            fechaFin,
            pedido.DETALLE_PEDIDO_id.cantidad  // Cantidad del detalle del pedido
        );

    } catch (error) {
        console.error('Error al obtener los datos del pedido:', error);
        alert('Hubo un error al cargar los datos del pedido');
    }
}

// Función para abrir el modal y llenar los datos
// Modificamos la función del modal para incluir la cantidad en el cálculo
function abrirModal(paciente, medicamento, receta, tiempoConsumo, fechaFin, cantidad, medicamentoId) {
    console.log('Abrir Modal con los siguientes datos:', {
        paciente: paciente,
        medicamento: medicamento,
        receta: receta,
        tiempoConsumo: tiempoConsumo,
        cantidad: cantidad,
        medicamentoId: medicamentoId
    });

    $('#modal-paciente').text(paciente);
    $('#modal-medicamento').text(medicamento);
    $('#modal-receta').val(receta);
    $('#modal-tiempo-consumo').val(tiempoConsumo);
    $('#modal-cantidad').val(cantidad);
    
    console.log('ID del medicamento en abrirModal:', medicamentoId);
    $('#modal-medicamento-id').val(medicamentoId); // Asignar el ID del medicamento
    $('#reabastecerModal').css('display', 'block');

    // Mostrar el ID del medicamento en pantalla
    

    if (!fechaFin || !/^\d{4}-\d{2}-\d{2}$/.test(fechaFin)) {
        alert("La fecha de fin proporcionada no es válida. Asegúrate de que esté en formato 'YYYY-MM-DD'.");
        return;
    }
    
    // La fecha de fin actual se convierte en la nueva fecha de inicio
    let nuevaFechaInicio = new Date(fechaFin);
    //let cantidad = parseInt($('#modal-cantidad').val()) || 1;
    // Calcular nueva fecha de fin basado en el tiempo de consumo y la cantidad
    let diasTotales = parseInt(tiempoConsumo) * parseInt(cantidad);
    let nuevaFechaFin = new Date(nuevaFechaInicio);
    nuevaFechaFin.setDate(nuevaFechaFin.getDate() + diasTotales); 

    if (isNaN(nuevaFechaFin.getTime())) {
        alert("Error al calcular la nueva fecha de fin.");
        return;
    }

    // Convertir fechas a formato 'YYYY-MM-DD'
    let nuevaFechaInicioFormatted = nuevaFechaInicio.toISOString().split('T')[0];
    let nuevaFechaFinFormatted = nuevaFechaFin.toISOString().split('T')[0];

    // Actualizamos los campos del modal
    $('#modal-fecha-inicio').val(nuevaFechaInicioFormatted); // Campo para la nueva fecha de inicio
    $('#modal-fecha-fin').val(nuevaFechaFinFormatted); // Campo para la nueva fecha de fin
    
    $('#reabastecerModal').css('display', 'block');

    const recetaData = {
        dosis_diaria: receta,
        tiempo_consumo: tiempoConsumo,
        fecha_inicio: fechaFin,
        fecha_fin: nuevaFechaFinFormatted
    };

    // Botón de confirmar reabastecimiento
    $('#confirmar-reabastecer').off('click').on('click', async function() {
        try {
            // Llamar a la función para crear la receta
            const nuevaReceta = await crearDetalleReceta(recetaData);
            if (!nuevaReceta) return;

            // Llamar a la función para crear la receta
            const nuevoDetallePedido = await crearDetallePedido(recetaData);
            if (!nuevoDetallePedido) return;

            // Aquí podrías agregar el código para manejar el pedido
            // Ejemplo:
            // const nuevoDetalle = await crearDetalle(detalleData, medicamentoId);
            // await crearPedido(nuevaReceta.id, nuevoDetalle.id);
            
            alert("Receta y Detalle Pedidos creados con éxito.");
            $('#reabastecerModal').css('display', 'none');
        } catch (error) {
            console.error('Error durante el proceso:', error);
            alert('Hubo un error al procesar los datos');
        }
    });

};
// Función para crear una nueva receta
async function crearDetalleReceta(data) {
    try {
        const response = await fetch('http://localhost:4000/datos/receta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Error al crear la receta');
        }
        
        const nuevaReceta = await response.json();
        return nuevaReceta; // Retornar la nueva receta creada
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al crear la receta');
    }
};

async function crearDetallePedido() {
    // Obtener los valores directamente del modal
    const cantidad = parseInt($('#modal-cantidad').val());
    const medicamentoId = parseInt($('#modal-medicamento-id').val());

    // Validar que los datos sean válidos
    if (!cantidad || isNaN(cantidad)) {
        alert('La cantidad debe ser un número válido');
        return null;
    }

    if (!medicamentoId || isNaN(medicamentoId)) {
        alert('ID de medicamento no válido');
        return null;
    }

    const detalleData = {
        cantidad: cantidad,
        MEDICAMENTO_id: medicamentoId
    };

    console.log('Enviando datos al servidor:', detalleData);

    try {
        const response = await fetch('http://localhost:4000/datos/detalle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(detalleData)
        });

        // Primero verificar si la respuesta es ok
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
        }

        // Solo intentar parsear como JSON si la respuesta es ok
        const data = await response.json();
        console.log('Respuesta exitosa del servidor:', data);
        return data;

    } catch (error) {
        console.error('Error completo:', error);
        alert(`Error al crear el detalle del pedido: ${error.message}`);
        return null;
    }
}

// Modificar también el evento del botón confirmar para mejor manejo de errores
$('#confirmar-reabastecer').off('click').on('click', async function() {
    try {
        // Obtener y validar los datos del modal
        let receta = $('#modal-receta').val();
        let tiempoConsumo = $('#modal-tiempo-consumo').val();
        let cantidad = $('#modal-cantidad').val();
        let nuevaFechaInicio = $('#modal-fecha-inicio').val();
        let nuevaFechaFin = $('#modal-fecha-fin').val();

        // Validar que todos los campos necesarios estén presentes
        if (!receta || !tiempoConsumo || !cantidad || !nuevaFechaInicio || !nuevaFechaFin) {
            alert('Por favor, complete todos los campos requeridos');
            return;
        }

        const recetaData = {
            dosis_diaria: receta,
            tiempo_consumo: parseInt(tiempoConsumo),
            fecha_inicio: nuevaFechaInicio,
            fecha_fin: nuevaFechaFin
        };

        // Crear la nueva receta
        const nuevaReceta = await crearDetalleReceta(recetaData);
        if (!nuevaReceta) {
            throw new Error('Error al crear la receta');
        }

        // Crear el detalle del pedido
        const nuevoDetalle = await crearDetallePedido();
        if (!nuevoDetalle) {
            throw new Error('Error al crear el detalle del pedido');
        }

        alert("Receta y Detalle de Pedido creados con éxito.");
        $('#reabastecerModal').css('display', 'none');

        // Limpiar campos del modal
        $('#modal-receta').val('');
        $('#modal-tiempo-consumo').val('');
        $('#modal-cantidad').val('');
        $('#modal-fecha-inicio').val('');
        $('#modal-fecha-fin').val('');
        $('#modal-medicamento-id').val('');

        // Opcional: Recargar la tabla para mostrar los nuevos datos
        $('#productTable').DataTable().ajax.reload();

    } catch (error) {
        console.error('Error durante el proceso:', error);
        alert(`Error: ${error.message}`);
    }
});


/*// Función para confirmar el reabastecimiento
function confirmarReabastecimiento() {
    alert("Reabastecimiento confirmado.");
    cerrarReabastecimientoModal();
}*/