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
                <td>${medicamento ? medicamento.codigo || 'No  disponible':  'No disponible'}</td>
                <td>${medicamento ? medicamento.descripcion : 'No disponible'}</td>
                <td>${paciente ? paciente.direccion || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.referencia || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.telefono || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.email || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.edad || 'No disponible' : 'No disponible'}</td>
                <td>${paciente ? paciente.nombre_encargado || 'No disponible' : 'No disponible'}</td>
                <td>${pacienteFactura ? pacienteFactura.nit || 'No disponible' : 'No disponible'}</td>
                <td>${pacienteFactura ? pacienteFactura.nomfac || 'No disponible' : 'No disponible'}</td>
                <td class="estado" style="cursor: pointer;" onclick="toggleEntrega(this)">${entregaStatus}</td> <!-- Nueva celda para entrega -->
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
    yPosition -= 40;

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
        
        return y - currentY; // Retorna el espacio usado
    };

    rows.forEach((row) => {
        // Verificar si hay espacio suficiente para un nuevo pedido
        if (yPosition < 150) {
            page = pdfDoc.addPage([842, 595]);
            yPosition = height - margin.top;
        }

        const cells = row.querySelectorAll("td");
        
        // Mapeo correcto de los datos según la estructura de la tabla
        const noPedido = cells[0].textContent;
        const fecha = cells[1].textContent;
        const nombrePaciente = cells[2].textContent;
        const cantidad = cells[3].textContent;
        const codigoMedicamento = cells[4].textContent;
        const medicamento = cells[5].textContent;
        const direccion = cells[6].textContent;
        const referencia = cells[7].textContent;
        const telefono = cells[8].textContent;
        const email = cells[9].textContent;
        const nit = cells[12].textContent;
        const nombreFactura = cells[13].textContent;
        const estado = cells[14].textContent;

        // Información general del pedido
        yPosition -= 30;
        page.drawText(`No Pedido: ${noPedido}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;
        
        page.drawText(`Fecha: ${fecha}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        page.drawText(`Paciente: ${nombrePaciente}`, { x: width/2, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;

        page.drawText(`NIT: ${nit}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        page.drawText(`Nombre Factura: ${nombreFactura}`, { x: width/2, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;

        // Información de contacto
        page.drawText(`Teléfono: ${telefono}`, { x: margin.left, y: yPosition, size: fontSizeText, font });
        page.drawText(`Email: ${email}`, { x: width/2, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;
        
        // Dirección y referencia
        const direccionCompleta = `Dirección: ${direccion}${referencia ? ` (Ref: ${referencia})` : ''}`;
        const direccionUsedSpace = drawWrappedText(
            direccionCompleta,
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

        // Encabezados de la tabla
        page.drawText("Código", { x: columnSpacing.codigo, y: yPosition, size: fontSizeText, font });
        page.drawText("Medicamento", { x: columnSpacing.medicamento, y: yPosition, size: fontSizeText, font });
        page.drawText("Cantidad", { x: columnSpacing.cantidad, y: yPosition, size: fontSizeText, font });
        page.drawText("Estado", { x: columnSpacing.estado, y: yPosition, size: fontSizeText, font });
        yPosition -= 25;

        // Datos del medicamento
        page.drawText(codigoMedicamento, { x: columnSpacing.codigo, y: yPosition, size: fontSizeText, font });
        
        const medicamentoUsedSpace = drawWrappedText(
            medicamento,
            columnSpacing.medicamento,
            yPosition,
            columnSpacing.cantidad - columnSpacing.medicamento - 20,
            20
        );
        
        page.drawText(cantidad, { x: columnSpacing.cantidad, y: yPosition, size: fontSizeText, font });
        page.drawText(estado, { x: columnSpacing.estado, y: yPosition, size: fontSizeText, font });

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