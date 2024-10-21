import sequelize from "../database/database.js";
import cliente from "../models/cliente.js";
import paciente from  "../models/paciente.js";
import doctor from   "../models/doctor.js";
import tipo from "../models/tipoEnfermedad.js";
import receta  from "../models/receta.js";
import fac from "../models/factura.js";
import medicamento from "../models/medicamentos.js";

const getAllFacWithRelations = async (req, res) => {
    try {
        const facWithRelations = await fac.findAll({
            attributes: ['id', 'CLIENTE_id', 'PACIENTE_id', 'DOCTOR_id', 'TIPO_ENFERMEDAD_id', 'RECETA_id', 'cod_factura', 'cantidad', 'fecha'],
            include: [
                {
                    model: cliente,
                    attributes: ['nombre_en_factura', 'direccion_de_entrega', 'telefono', 'email']
                },
                {
                    model: paciente,
                    attributes: ['nombre', 'apellido', 'edad', 'nombre_encargado']
                },
                {
                    model: doctor,
                    attributes: ['nombre', 'institucion', 'email']
                },
                {
                    model: tipo,
                    attributes: ['cronica', 'aguda']
                },
                {
                    model: receta,
                    attributes: ['dosis_diaria', 'cantidad_diaria', 'tiempo'],
                    include: [
                        {
                            model: medicamento,
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
        FECHA, 
        cantidad 
    } = req.body;

    const t = await sequelize.transaction(); // Iniciar una transacción

    try {
        // Verificar si el cliente ya existe
        let existingCliente = await cliente.findOne({
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
            // Generar codclie automáticamente
            CLIENTE_id.codclie = await generateCodclie();
            console.log('Generated codclie:', CLIENTE_id.codclie); // Log para depuración

            if (!CLIENTE_id.codclie) {
                throw new Error('Generated codclie is null');
            }

            existingCliente = await cliente.create(CLIENTE_id, { transaction: t });
        }

        // Verificar si el paciente ya existe
        let existingPaciente = await paciente.findOne({
            
            where: {
                nombre: PACIENTE_id.nombre,
                apellido: PACIENTE_id.apellido,
                edad: PACIENTE_id.edad,
                nombre_encargado: PACIENTE_id.nombre_encargado, // Asegúrate de que este nombre coincida
            },
            transaction: t
        });

        if (!existingPaciente) {
            existingPaciente = await paciente.create(PACIENTE_id, { transaction: t });
        }

        // Verificar si el doctor ya existe
        let existingDoctor = await doctor.findOne({
            where: {
                nombre: DOCTOR_id.nombre,
                institucion:  DOCTOR_id.institucion,
                sede:   DOCTOR_id.sede,
                email: DOCTOR_id.email // Puedes añadir más campos según sea necesario
            },
            transaction: t
        });

        if (!existingDoctor) {
            existingDoctor = await doctor.create(DOCTOR_id, { transaction: t });
        }

        // Verificar si el tipo de enfermedad ya existe
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

        // Verificar si el medicamento ya existe por descripción
        let existingMedicamento = await medicamento.findOne({
            where: {
                descripcion: RECETA_id.MEDICAMENTO_id.descripcion // Verificando la descripción
            },
            transaction: t
        });

        // Crear la receta y asociar el medicamento
        const existingReceta = await receta.create({
            dosis_diaria: RECETA_id.dosis_diaria,
            cantidad_diaria: RECETA_id.cantidad_diaria,
            tiempo: RECETA_id.tiempo,
            MEDICAMENTO_id: existingMedicamento.id // Asegúrate de que esta relación exista en tu modelo
        }, { transaction: t });

        // Generar el próximo número de factura
        const latestFactura = await fac.findOne({
            order: [['cod_factura', 'DESC']],
            transaction: t
        });

        let nextCodFactura = 10001; // Valor inicial si no existen facturas
        if (latestFactura) {
            nextCodFactura = parseInt(latestFactura.cod_factura.split(' ')[1]) + 1;
        }

        const formattedCodFactura = `CRM ${nextCodFactura}`;

        // Crear la nueva factura
        const newFactura = await fac.create({
            CLIENTE_id: existingCliente.id,
            PACIENTE_id: existingPaciente.id,
            DOCTOR_id: existingDoctor.id,
            TIPO_ENFERMEDAD_id: existingTipoEnfermedad.id,
            RECETA_id: existingReceta.id,
            FECHA,
            cod_factura: formattedCodFactura,
            cantidad
        }, { transaction: t });

        // Confirmar la transacción
        await t.commit();

        res.status(201).json({ message: 'Factura creada correctamente', factura: newFactura });
    } catch (error) {
        // Revertir la transacción en caso de error
        await t.rollback();
        console.error('Error al crear factura:', error);
        res.status(500).json({ message: 'Error al crear factura' });
    }
};

export const methods = { 
    getAllFacWithRelations,
    createFactura
};

