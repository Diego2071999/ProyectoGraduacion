$(document).ready(function () {
  var url = 'http://localhost:4000/datos/pedido';
  var recetasUrl = 'http://localhost:4000/datos/recetas';
  var detalleUrl = 'http://localhost:4000/datos/detalle';

  Promise.all([fetch(recetasUrl), fetch(detalleUrl)])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([recetasData, detalleData]) => {
      console.log('Datos de recetas:', recetasData);

      // Crear mapa de medicamentos
      const medicamentosMap = {};
      detalleData.forEach(detalle => {
        medicamentosMap[detalle.medicamento.id] = detalle.medicamento.descripcion;
      });

      // Crear mapa de pacientes
      const pacientesMap = {};
      recetasData.forEach(receta => {
        if (receta.paciente) {
          pacientesMap[receta.PACIENTE_cod] = {
            nombre: receta.paciente.nombre,
            apellido: receta.paciente.apellido,
            nombreCompleto: `${receta.paciente.nombre} ${receta.paciente.apellido}`
          };
        }
      });

      var table = $('#tablaPedidos').DataTable({
        "ajax": {
          "url": url,
          "dataSrc": ""
        },
        "columns": [
          { "data": "id" },
          { "data": "fecha" },
          {
            "data": null,
            "render": function (data, type, row) {
              const pacienteCod = row.recetas ? row.recetas.PACIENTE_cod : null;

              if (pacienteCod && pacientesMap[pacienteCod]) {
                const paciente = pacientesMap[pacienteCod];
                return `<div class="paciente-info">
                          <span class="nombre-completo">${paciente.nombreCompleto}</span>
                       </div>`;
              } else {
                return '<div class="paciente-info">Paciente no encontrado</div>';
              }
            }
          },
          {
            "data": "detallePedido.cantidad",
            "defaultContent": "0"
          },
          {
            "data": "detallePedido.MEDICAMENTO_id",
            "render": function (data) {
              return medicamentosMap[data] || 'Medicamento no encontrado';
            }
          },
        ],
        "language": {
          "search": "Buscar paciente:",
          "zeroRecords": "No se encontraron resultados",
          "info": "Mostrando _START_ a _END_ de _TOTAL_ registros",
          "infoEmpty": "Mostrando 0 a 0 de 0 registros",
          "infoFiltered": "(filtrado de _MAX_ registros totales)"
        }
      });

      $('#customSearchContainer').append($('.dataTables_filter'));

      $('.dataTables_filter input').on('input', function () {
        table.search(this.value).draw();
      });

      document.getElementById('newDoctorForm')?.addEventListener('submit', function (event) {
        event.preventDefault();
        crearNuevoDoctor();
      });
    })
    .catch(error => {
      console.error('Error al cargar los datos:', error);
      alert('Hubo un error al cargar los datos. Por favor, revisa la consola para más detalles.');
    });
});

// Función para ordenar la tabla de pedidos
function ordenarPor(criterio) {
  const columnasOrdenamiento = {
    'nombre': 2, // Índice de la columna que contiene el nombre del paciente
    'medicamento': 4,     // Índice de la columna que contiene el medicamento
    'fecha': 1            // Índice de la columna de fecha
  };

  if (criterio in columnasOrdenamiento) {
    const tabla = $('#tablaPedidos').DataTable();
    tabla.order([columnasOrdenamiento[criterio], 'asc']).draw();
  }
}