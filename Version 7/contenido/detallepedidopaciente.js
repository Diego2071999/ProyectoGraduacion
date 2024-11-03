// detallepedidopaciente.html script
$(document).ready(function() {
    // Obtener el ID del paciente de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');
    
    if (!pacienteId) {
        alert('No se especificó un ID de paciente');
        return;
    }

    // URLs de las APIs
    const urls = {
        pedidos: 'http://localhost:4000/datos/pedido',
        recetas: 'http://localhost:4000/datos/recetas',
        detalle: 'http://localhost:4000/datos/detalle',
        pacientes: `http://localhost:4000/datos/paci/${pacienteId}`
    };

    // Cargar todos los datos necesarios
    Promise.all([
        fetch(urls.pedidos),
        fetch(urls.recetas),
        fetch(urls.detalle),
        fetch(urls.pacientes)
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(([pedidosData, recetasData, detalleData, pacienteData]) => {
        // Encontrar todos los pedidos del paciente
        const pedidosDelPaciente = pedidosData.filter(pedido => {
            const receta = recetasData.find(r => r.id === pedido.recetas?.id);
            return receta?.PACIENTE_cod === pacienteId;
        });

        // Crear mapa de medicamentos
        const medicamentosMap = {};
        detalleData.forEach(detalle => {
            medicamentosMap[detalle.medicamento.id] = detalle.medicamento;
        });

        // Limpiar la tabla existente
        $('#tablaPedidos tbody').empty();

        // Agregar los datos del paciente en la sección de información
        const infoHtml = `
            <div class="patient-info card mb-4">
                <div class="card-header bg-primary text-white">
                    <h3>Información del Paciente</h3>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Nombre:</strong> ${pacienteData.nombre} ${pacienteData.apellido}</p>
                            <p><strong>Teléfono:</strong> ${pacienteData.telefono || 'No disponible'}</p>
                            <p><strong>Email:</strong> ${pacienteData.email || 'No disponible'}</p>
                            <p><strong>Edad:</strong> ${pacienteData.edad || 'No disponible'}</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Dirección:</strong> ${pacienteData.direccion || 'No disponible'}</p>
                            <p><strong>Referencia:</strong> ${pacienteData.referencia || 'No disponible'}</p>
                            <p><strong>Encargado:</strong> ${pacienteData.nombre_encargado || 'No disponible'}</p>
                            <p><strong>NIT:</strong> ${pacienteData.Factura?.nit || 'No disponible'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Insertar la información del paciente antes de la tabla
        $('#tablaPedidos').before(infoHtml);

        // Crear las filas para cada pedido
        pedidosDelPaciente.forEach(pedido => {
            const medicamento = medicamentosMap[pedido.detallePedido?.MEDICAMENTO_id];
            const entregaStatus = localStorage.getItem(`pedido_${pedido.id}`) || 
                                (pedido.entregado ? 'Entregado' : 'No entregado');

            const row = `
                <tr>
                    <td>${pedido.id}</td>
                    <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
                    <td>${medicamento ? medicamento.codigo : 'No disponible'}</td>
                    <td>${medicamento ? medicamento.descripcion : 'No disponible'}</td>
                    <td>${pedido.detallePedido?.cantidad || 'No especificada'}</td>
                    <td class="estado" style="cursor: pointer;" 
                        onclick="toggleEntrega(this, ${pedido.id})">${entregaStatus}</td>
                </tr>
            `;

            $('#tablaPedidos tbody').append(row);
        });

        // Inicializar DataTable
        if (!$.fn.DataTable.isDataTable('#tablaPedidos')) {
            $('#tablaPedidos').DataTable({
                "language": {
                    "search": "Buscar en pedidos:",
                    "zeroRecords": "No se encontraron pedidos para este paciente",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ pedidos",
                    "infoEmpty": "No hay pedidos disponibles",
                    "infoFiltered": "(filtrado de _MAX_ pedidos totales)"
                },
                "order": [[1, 'desc']], // Ordenar por fecha descendente
                "columns": [
                    { title: "ID Pedido" },
                    { title: "Fecha" },
                    { title: "Código Medicamento" },
                    { title: "Medicamento" },
                    { title: "Cantidad" },
                    { title: "Estado" }
                ]
            });
        }

        // Actualizar el título
        $('h2').text(`Historial de Pedidos - ${pacienteData.nombre} ${pacienteData.apellido}`);

        // Agregar botones de acción
        if (!$('.action-buttons').length) {
            $('.dataTables_wrapper').before(`
                <div class="action-buttons mb-3">
                    <button class="btn btn-secondary mr-2" onclick="window.history.back()">
                        Volver a Pedidos
                    </button>
                    <button class="btn btn-primary" onclick="generatePDF()">
                        Generar PDF
                    </button>
                </div>
            `);
        }
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        $('#errorMessage').html(`
            <div class="alert alert-danger">
                Error al cargar los datos del paciente. Por favor, intente nuevamente.
            </div>
        `);
    });
});

// Función actualizada para toggle de entrega
function toggleEntrega(cell, pedidoId) {
    const currentStatus = cell.innerText;
    
    if (currentStatus === 'Entregado') {
        alert('Este pedido ya ha sido marcado como entregado y no puede ser cambiado.');
        return;
    }

    if (currentStatus === 'No entregado') {
        cell.innerText = 'Entregado';
        cell.style.cursor = 'default';
        cell.onclick = null;
        localStorage.setItem(`pedido_${pedidoId}`, 'Entregado');
    }
}

// Import pdf-lib if working in a Node.js environment
// const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");

document.getElementById("generate-pdf-btn").addEventListener("click", generatePDF);

async function generatePDF() {
    const { PDFDocument, rgb, StandardFonts } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // Tamaño A4 en modo horizontal
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSizeTitle = 18;
    const fontSizeText = 12;
    const { width, height } = page.getSize();
    
    // Definir márgenes y espaciados
    const margin = {
        left: 50,
        right: 50,
        top: 80
    };
    const columnSpacing = {
        codigo: margin.left,
        medicamento: margin.left + 120,
        cantidad: margin.left + 350,
        estado: margin.left + 450
    };
    
    let yPosition = height - margin.top;

    // Título
    page.drawText("Detalle de Pedido", {
        x: width / 2 - 60,
        y: yPosition,
        size: fontSizeTitle,
        font,
        color: rgb(0, 0, 0)
    });
    yPosition -= 40; // Mayor espacio después del título

    // Obtener datos de la tabla
    const rows = document.querySelectorAll("#tablaPedidos tbody tr");
    if (rows.length === 0) {
        alert("No hay datos para generar el PDF.");
        return;
    }

    // Función para manejar texto largo
    const drawWrappedText = (text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let currentY = y;
        
        words.forEach(word => {
            const testLine = line + word + ' ';
            const testWidth = font.widthOfTextAtSize(testLine, fontSizeText);
            
            if (testWidth > maxWidth && line !== '') {
                page.drawText(line, { x, y: currentY, size: fontSizeText, font });
                line = word + ' ';
                currentY -= lineHeight;
            } else {
                line = testLine;
            }
        });
        
        if (line.trim() !== '') {
            page.drawText(line, { x, y: currentY, size: fontSizeText, font });
        }
        
        return Math.min(y - currentY); // Retorna el espacio usado
    };

    rows.forEach((row, index) => {
        // Verificar si hay espacio suficiente para un nuevo pedido
        if (yPosition < 150) {
            // Agregar nueva página
            page = pdfDoc.addPage([842, 595]);
            yPosition = height - margin.top;
        }

        const cells = row.querySelectorAll("td");
        
        // Obtener datos
        const noPedido = cells[0].textContent || "No disponible";
        const nit = cells[1].textContent || "No disponible";
        const nombreFactura = cells[2].textContent || "No disponible";
        const direccion = cells[3].textContent || "No disponible";
        const codigoMedicamento = cells[4].textContent || "No disponible";
        const medicamento = cells[5].textContent || "No disponible";
        const cantidad = cells[6].textContent || "No disponible";
        const estado = cells[7].textContent || "No disponible";

        // Información general del pedido con mayor espaciado
        yPosition -= 30;
        page.drawText(`No Pedido: ${noPedido}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;
        page.drawText(`NIT: ${nit}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        page.drawText(`Nombre Factura: ${nombreFactura}`, { x: width/2, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;
        
        // Manejar dirección larga
        const direccionUsedSpace = drawWrappedText(
            `Dirección: ${direccion}`,
            margin.left,
            yPosition,
            width - margin.left - margin.right,
            20
        );
        yPosition -= direccionUsedSpace + 30;

        // Encabezado de detalles
        page.drawText("Detalles del Medicamento:", { 
            x: margin.left, 
            y: yPosition, 
            size: fontSizeText, 
            font,
            color: rgb(0.2, 0.2, 0.8)
        });
        yPosition -= 25;

        // Encabezados de la tabla con espaciado mejorado
        page.drawText("Código", { x: columnSpacing.codigo, y: yPosition, size: fontSizeText, font });
        page.drawText("Medicamento", { x: columnSpacing.medicamento, y: yPosition, size: fontSizeText, font });
        page.drawText("Cantidad", { x: columnSpacing.cantidad, y: yPosition, size: fontSizeText, font });
        page.drawText("Estado", { x: columnSpacing.estado, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;

        // Datos de la tabla con espaciado mejorado
        page.drawText(codigoMedicamento, { x: columnSpacing.codigo, y: yPosition, size: fontSizeText, font });
        
        // Manejar nombre de medicamento largo
        const medicamentoUsedSpace = drawWrappedText(
            medicamento,
            columnSpacing.medicamento,
            yPosition,
            columnSpacing.cantidad - columnSpacing.medicamento - 20,
            20
        );
        
        page.drawText(cantidad, { x: columnSpacing.cantidad, y: yPosition, size: fontSizeText, font });
        page.drawText(estado, { x: columnSpacing.estado, y: yPosition, size: fontSizeText, font });

        // Ajustar espaciado final según el contenido
        yPosition -= Math.max(medicamentoUsedSpace + 40, 60);
    });

    // Guardar y descargar el PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Detalle_Pedido.pdf";
    link.click();
}


// Función para el botón de nuevo pedido
function createNewOrder() {
    // Implementa la lógica para crear un nuevo pedido
    alert('Funcionalidad de nuevo pedido en desarrollo');
}