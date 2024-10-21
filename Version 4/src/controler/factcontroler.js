import sequelize from "../database/database.js";
import Clientes from "../models/cliente.js";
import Pacientes from "../models/paciente.js";
import Doctores from "../models/doctor.js";
import Recetas from "../models/receta.js";
import Facturas from "../models/factura.js";
import Medicamentos from "../models/medicamentos.js";
import TiposEnfermedad from "../models/tipoEnfermedad.js";

const getAllFacWithRelations = async (req, res) => {
    try {
        const facWithRelations = await Facturas.findAll({
            attributes: ['id', 'CLIENTE_id', 'PACIENTE_id', 'DOCTOR_id', 'TIPO_ENFERMEDAD_id', 'RECETA_id', 'cod_factura', 'cantidad', 'fecha'],
            include: [
                {
                    model: Clientes,
                    attributes: ['nombre_en_factura', 'direccion_de_entrega', 'telefono', 'email']
                },
                {
                    model: Pacientes,
                    attributes: ['nombre', 'apellido', 'edad', 'nombre_encargado']
                },
                {
                    model: Doctores,
                    attributes: ['nombre', 'institucion', 'email']
                },
                {
                    model: TiposEnfermedad,
                    attributes: ['cronica', 'aguda']
                },
                {
                    model: Recetas,
                    attributes: ['dosis_diaria', 'cantidad_diaria', 'tiempo'],
                    include: [
                        {
                            model: Medicamentos,
                            attributes: ['nombre', 'contenido', 'presentacion'], // Asegúrate de usar los atributos correctos
                        }
                    ]
                }
            ]
        });

        res.status(200).json(facWithRelations);
    } catch (error) {
        console.error('Error al obtener los registros con sus relaciones:', error);
        res.status(500).json({ message: 'Error al obtener los registros con sus relaciones' });
    }
};


const createFactura = async (req, res) => {
    const { 
        CLIENTE_id, 
        PACIENTE_id, 
        DOCTOR_id, 
        TIPO_ENFERMEDAD_id, 
        RECETA_id, 
        cantidad,
        medicamentoDescripcion 
    } = req.body;

    const t = await sequelize.transaction(); // Iniciar una transacción

    try {
        // Verificar o crear el cliente
        let existingCliente = await Clientes.findOne({
            where: {
                NIT: CLIENTE_id.NIT,
                nombre_en_factura: CLIENTE_id.nombre_en_factura,
                direccion_de_entrega: CLIENTE_id.direccion_de_entrega,
                referencia: CLIENTE_id.referencia,
                telefono: CLIENTE_id.telefono,
                telefono2: CLIENTE_id.telefono2,
                email: CLIENTE_id.email,
            },
            transaction: t
        });

        if (!existingCliente) {
            CLIENTE_id.codclie = await generateCodclie();
            existingCliente = await Clientes.create(CLIENTE_id, { transaction: t });
        }

        // Verificar o crear el paciente
        let existingPaciente = await Pacientes.findOne({
            where: {
                nombre: PACIENTE_id.nombre,
                apellido: PACIENTE_id.apellido,
                edad: PACIENTE_id.edad,
                nombre_encargado: PACIENTE_id.nombre_encargado,
            },
            transaction: t
        });

        if (!existingPaciente) {
            existingPaciente = await Pacientes.create(PACIENTE_id, { transaction: t });
        }

        // Verificar o crear el doctor
        let existingDoctor = await Doctores.findOne({
            where: {
                nombre: DOCTOR_id.nombre,
                institucion: DOCTOR_id.institucion,
                sede: DOCTOR_id.sede,
                email: DOCTOR_id.email
            },
            transaction: t
        });

        if (!existingDoctor) {
            existingDoctor = await Doctores.create(DOCTOR_id, { transaction: t });
        }

        // Verificar que el ID del doctor sea válido
        if (!existingDoctor || !existingDoctor.id) {
            throw new Error('Error: No se pudo crear o recuperar el ID del doctor');
        }

        // Verificar o crear el tipo de enfermedad
        let existingTipoEnfermedad = await TiposEnfermedad.findOne({
            where: {
                cronica: TIPO_ENFERMEDAD_id.cronica,
                aguda: TIPO_ENFERMEDAD_id.aguda
            },
            transaction: t
        });

        if (!existingTipoEnfermedad) {
            existingTipoEnfermedad = await TiposEnfermedad.create(TIPO_ENFERMEDAD_id, { transaction: t });
        }

        // Verificar si el medicamento existe por descripción
        let existingMedicamento;
        if (medicamentoDescripcion) {
            existingMedicamento = await Medicamentos.findOne({
                where: {
                    descripcion: medicamentoDescripcion
                },
                transaction: t
            });
        }

        // Crear la receta
        console.log('Creando receta con DOCTOR_id:', existingDoctor.id);
        console.log('Creando receta con MEDICAMENTO_id:', existingMedicamento ? existingMedicamento.id : null);
        
        const existingReceta = await Recetas.create({
            dosis_diaria: RECETA_id.dosis_diaria,
            cantidad_diaria: RECETA_id.cantidad_diaria,
            tiempo: RECETA_id.tiempo,
            MEDICAMENTO_id: existingMedicamento ? existingMedicamento.id : null,
            DOCTOR_id: existingDoctor.id // Usar el ID del doctor
        }, { transaction: t });

        // Obtener el último cod_factura y calcular el nuevo
        const latestFactura = await Facturas.findOne({
            order: [['cod_factura', 'DESC']],
            transaction: t
        });

        const newCodFactura = latestFactura ? latestFactura.cod_factura + 1 : 1001; // Iniciar en 1001 si no hay facturas

        // Crear la nueva factura
        const currentDate = new Date(); // Obtiene la fecha actual
        console.log('Fecha actual:', currentDate);

        const facturaData = {
            CLIENTE_id: existingCliente.id,
            PACIENTE_id: existingPaciente.id,
            DOCTOR_id: existingDoctor.id,
            TIPO_ENFERMEDAD_id: existingTipoEnfermedad.id,
            RECETA_id: existingReceta.id,
            fecha: currentDate, // Usar la fecha actual
            cantidad,
            cod_factura: newCodFactura
        };

        console.log('Datos de la nueva factura:', facturaData); // Verifica los datos

        const newFactura = await Facturas.create(facturaData, { transaction: t });

        // Confirmar la transacción
        await t.commit();

        res.status(201).json({ message: 'Factura creada correctamente', factura: newFactura });
    } catch (error) {
        // Revertir la transacción en caso de error
        await t.rollback();
        console.error('Error al crear factura:', error);
        res.status(500).json({ message: 'Error al crear factura', error: error.message });
    }
};

export const methods = { 
    getAllFacWithRelations,
    createFactura
};

