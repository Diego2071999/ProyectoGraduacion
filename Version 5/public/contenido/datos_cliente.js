document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('facturaForm');

    const fetchDoctorsAndMedicines = async () => {
        const [doctors, medicines] = await Promise.all([
            fetch('http://localhost:4000/datos/doc').then(res => res.json()),
            fetch('http://localhost:4000/med/medi').then(res => res.json()),
        ]);

        const doctorSelect = document.getElementById('dropdownDoc');
        const medicineSelect = document.getElementById('dropdown');

        doctors.forEach(doctor => {
            const option = document.createElement('option');
            option.value = doctor.id;
            option.textContent = doctor.nombre;
            doctorSelect.appendChild(option);
        });

        medicines.forEach(medicine => {
            const option = document.createElement('option');
            option.value = medicine.id;
            option.textContent = medicine.nombre;
            medicineSelect.appendChild(option);
        });
    };

    fetchDoctorsAndMedicines();

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const pacienteData = {
            nit: document.getElementById('inputNIT').value,
            nomfac: document.getElementById('inputNombreFactura').value,
            direccion: document.getElementById('inputDireccionEntrega').value,
            referencia: document.getElementById('inputReferencia').value,
            telefono: document.getElementById('inputTelefono').value,
            telefono2: document.getElementById('inputTelefono2').value,
            email: document.getElementById('inputEmail').value,
            nombre: document.getElementById('inputNombrePaciente').value,
            apellido: document.getElementById('inputApellidoPaciente').value,
            edad: document.getElementById('inputEdad').value,
            nombre_encargado: document.getElementById('inputNombreEncargado').value
        };

        console.log('Datos del paciente:', pacienteData); // Verifica los datos

        const doctorId = document.getElementById('dropdownDoc').value; // ID del doctor
        const medicineId = document.getElementById('dropdown').value;
        const cantidad = document.getElementById('inputCantidad').value;
        const dosisDiaria = document.getElementById('inputDosisDiaria').value;
        const tiempo = document.getElementById('inputTiempo').value;

        try {
            // Crear paciente
            const pacienteResponse = await fetch('http://localhost:4000/datos/paci', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(pacienteData)
            });

            if (!pacienteResponse.ok) {
                const errorText = await pacienteResponse.text();
                throw new Error(`Error al crear paciente: ${errorText}`);
            }
            const paciente = await pacienteResponse.json();
            console.log('Paciente creado:', paciente);

            // Verifica que el ID del paciente esté definido
            if (!paciente.id) {
                throw new Error('El ID del paciente no se ha recibido correctamente.');
            }
            if (!paciente.id) {
                throw new Error('El ID del paciente no se ha recibido correctamente.');
            }

            // Crear relación Doctor-Paciente
            // Crear relación Doctor-Paciente (usando el ID del paciente recién creado y el ID del doctor seleccionado)
            const doctorPacienteData = {
                PACIENTE_cod: paciente.id,  // el id del paciente recién creado
                DOCTOR_id: doctorId         // el id del doctor seleccionado
            };

            const doctorPacienteResponse = await fetch('http://localhost:4000/datos/docpaci', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(doctorPacienteData)
            });

            if (!doctorPacienteResponse.ok) {
                const errorText = await doctorPacienteResponse.text();
                throw new Error(`Error al crear relación doctor-paciente: ${errorText}`);
            }

            const doctorPaciente = await doctorPacienteResponse.json();
            console.log('Relación Doctor-Paciente creada:', doctorPaciente);

            // Puedes agregar una alerta o redireccionar a otra página
           // alert('Paciente y relación con doctor creados exitosamente.');

            // Cálculo de fecha de fin basándose en la dosis diaria y la cantidad
            const diasDeTratamiento = Math.ceil(cantidad / dosisDiaria); // Calcula los días necesarios
            const fechaInicio = new Date();
            const fechaFin = new Date(fechaInicio);
            fechaFin.setDate(fechaInicio.getDate() + diasDeTratamiento); // Agrega los días de tratamiento

            // Crear detalle de receta
            const detalleRecetaResponse = await fetch('http://localhost:4000/datos/receta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dosis_diaria: dosisDiaria,
                    tiempo_consumo: tiempo,
                    fecha_inicio: fechaInicio.toISOString().split('T')[0],
                    fecha_fin: fechaFin.toISOString().split('T')[0] // Usa la nueva fecha fin calculada
                })
            });

            // Manejo de errores en la respuesta
            if (!detalleRecetaResponse.ok) {
                const errorText = await detalleRecetaResponse.text();
                throw new Error(`Error al crear detalle de receta: ${errorText}`);
            }

            const detalleReceta = await detalleRecetaResponse.json();
            console.log('Detalle de receta creado:', detalleReceta);

            // Verifica que el ID del detalle de receta esté definido
            if (!detalleReceta.id) {
                throw new Error('El ID del detalle de receta no se ha recibido correctamente.');
            }

            // Crear receta
            const recetaResponse = await fetch('http://localhost:4000/datos/recetas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    DETALLE_RECETA_id: detalleReceta.id,
                    MEDICAMENTO_id: medicineId,
                    PACIENTE_cod: paciente.id // Asegúrate de usar paciente.id aquí
                })
            });

            if (!recetaResponse.ok) throw new Error('Error al crear receta');

            // Crear detalle de pedido
            const detallePedidoResponse = await fetch('http://localhost:4000/datos/detalle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cantidad: cantidad,
                    MEDICAMENTO_id: medicineId
                })
            });

            if (!detallePedidoResponse.ok) throw new Error('Error al crear detalle de pedido');
            const detallePedido = await detallePedidoResponse.json();

            // Crear pedido
            const pedidoResponse = await fetch('http://localhost:4000/datos/pedido', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fecha: new Date().toISOString().split('T')[0],
                    DETALLE_PEDIDO_id: detallePedido.id,
                    RECETA_id: (await recetaResponse.json()).id // Asegúrate de usar el ID de la receta creada
                })
            });

            if (!pedidoResponse.ok) throw new Error('Error al crear pedido');

            //alert('Factura creada correctamente');
            form.reset(); // Reiniciar el formulario
        } catch (error) {
            console.error('Error al crear la factura:', error);
            alert('Ocurrió un error al crear la factura: ' + error.message);
        }
    })
});