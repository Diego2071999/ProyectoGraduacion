/*document.addEventListener('DOMContentLoaded', function () {
    const loadDoctors = async () => {
        const dropdownDoc = document.getElementById('dropdownDoc');
        try {
            const response = await fetch('http://localhost:4000/datos/doc');
            const data = await response.json();
            data.forEach(item => {
                const option = document.createElement('option');
                option.text = item.nombre; // Suponiendo que el campo en la base de datos se llama 'nombre'
                option.value = item.id; // Suponiendo que el campo en la base de datos se llama 'id'
                dropdownDoc.add(option);
            });
        } catch (error) {
            console.error('Error al cargar los datos de doctores:', error);
        }
    };

    const loadMedicines = async () => {
        const dropdownMed = document.getElementById('dropdown');
        try {
            const response = await fetch('http://localhost:4000/med/medi');
            const data = await response.json();
            data.forEach(item => {
                const option = document.createElement('option');
                option.text = item.descripcion; // Suponiendo que el campo en la base de datos se llama 'descripcion'
                option.value = item.id; // Suponiendo que el campo en la base de datos se llama 'id'
                dropdownMed.add(option);
            });
        } catch (error) {
            console.error('Error al cargar los datos de medicamentos:', error);
        }
    };

    loadDoctors();
    loadMedicines();
});*/
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
        const cantidadDiaria = document.getElementById('inputCantidadDiaria').value;
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

        // Crear relación Doctor-Paciente
        const doctorPacienteResponse = await fetch('http://localhost:4000/datos/docpaci', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                PACIENTE_cod: paciente.id, // Asegúrate de que esto sea el campo correcto
                DOCTOR_id: doctorId
            })
        });

        if (!doctorPacienteResponse.ok) {
            const errorText = await doctorPacienteResponse.text();
            throw new Error(`Error al crear relación Doctor-Paciente: ${errorText}`);
        }

        const doctorPaciente = await doctorPacienteResponse.json();
        console.log('Relación Doctor-Paciente creada:', doctorPaciente);


        // Crear detalle de receta
        const detalleRecetaResponse = await fetch('http://localhost:4000/datos/receta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                dosis_diaria: dosisDiaria,
                consumo_diario: cantidadDiaria,
                tiempo_consumo: tiempo,
                fecha_inicio: new Date().toISOString().split('T')[0],
                fecha_fin: new Date(Date.now() + tiempo * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            })
        });

        if (!detalleRecetaResponse.ok) throw new Error('Error al crear detalle de receta');
        const detalleReceta = await detalleRecetaResponse.json();

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
                RECETA_id: recetaResponse.id // Asegúrate de usar recetaResponse.id aquí
            })
        });

        if (!pedidoResponse.ok) throw new Error('Error al crear pedido');

        alert('Factura creada correctamente');
        form.reset(); // Reiniciar el formulario
    } catch (error) {
        console.error('Error al crear la factura:', error);
        alert('Ocurrió un error al crear la factura: ' + error.message);
    }
})
});