import sequelize from "../database/database.js";
import Paciente from "../models/pacienteV2.js";
import Doctor from "../models/doctorV2.js";
import DetalleReceta from "../models/detalleReceta.js";

//mostrar todos
// Mostrar todos los pacientes
const getAllPacientes = async (req, res) => {
    try {
        const pacientes = await Paciente.findAll();
        res.status(200).json(pacientes);
    } catch (error) {
        console.error('Error al obtener los pacientes:', error);
        res.status(500).json({ message: 'Error retrieving pacientes' });
    }
};

// Mostrar todos los doctores
const getAllDoctores = async (req, res) => {
    try {
        const doctores = await Doctor.findAll();
        res.status(200).json(doctores);
    } catch (error) {
        console.error('Error al obtener los doctores:', error);
        res.status(500).json({ message: 'Error retrieving doctores' });
    }
};

// Mostrar todos los detalles de recetas
const getAllDetalleRecetas = async (req, res) => {
    try {
        const detallesRecetas = await DetalleReceta.findAll();
        res.status(200).json(detallesRecetas);
    } catch (error) {
        console.error('Error al obtener los detalles de receta:', error);
        res.status(500).json({ message: 'Error retrieving detalles de receta' });
    }
};

//mostrar 1 dato
// Mostrar un paciente por ID
const getPaciente = async (req, res) => {
    try {
        const paciente = await Paciente.findOne({
            where: { id: req.params.id }
        });
        if (paciente) {
            res.json(paciente);
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el paciente:', error);
        res.status(500).send(error.message);
    }
};
// Mostrar un doctor por ID
const getDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({
            where: { id: req.params.id }
        });
        if (doctor) {
            res.json(doctor);
        } else {
            res.status(404).json({ message: 'Doctor no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el doctor:', error);
        res.status(500).send(error.message);
    }
};
// Mostrar un detalle de receta por ID
const getDetalleReceta = async (req, res) => {
    try {
        const detalleReceta = await DetalleReceta.findOne({
            where: { id: req.params.id }
        });
        if (detalleReceta) {
            res.json(detalleReceta);
        } else {
            res.status(404).json({ message: 'Detalle de receta no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el detalle de receta:', error);
        res.status(500).send(error.message);
    }
};

//crear dato
// Crear un nuevo paciente
const createPaciente = async (req, res) => {
    try {
        // Crear el paciente y devolver el objeto completo
        const nuevoPaciente = await Paciente.create(req.body);

        // Responder con el paciente recién creado, incluyendo el id
        res.status(200).json(nuevoPaciente);
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.status(500).send(error.message);
    }
};


// Crear un nuevo doctor
const createDoctor = async (req, res) => {
    try {
        await Doctor.create(req.body);
        res.json({ message: '¡Doctor creado correctamente!' });
    } catch (error) {
        console.error('Error al crear el doctor:', error);
        res.status(500).send(error.message);
    }
};

const createDetalleReceta = async (req, res) => {
    try {
        // Crear el detalle de receta y devolver el objeto completo
        const nuevoDetalleReceta = await DetalleReceta.create(req.body);

        // Responder con el detalle de receta recién creado, incluyendo el id
        res.status(201).json(nuevoDetalleReceta);
    } catch (error) {
        console.error('Error al crear el detalle de receta:', error);
        res.status(500).send(error.message);
    }
};

//actualizar
const updatePaciente = async (req, res) => {
    try {
        const result = await Paciente.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ message: '¡Paciente actualizado correctamente!' });
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        res.status(500).send(error.message);
    }
};

// Actualizar un doctor por ID
const updateDoctor = async (req, res) => {
    try {
        const result = await Doctor.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ message: '¡Doctor actualizado correctamente!' });
        } else {
            res.status(404).json({ message: 'Doctor no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el doctor:', error);
        res.status(500).send(error.message);
    }
};

// Actualizar un detalle de receta por ID
const updateDetalleReceta = async (req, res) => {
    try {
        const result = await DetalleReceta.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ message: '¡Detalle de receta actualizado correctamente!' });
        } else {
            res.status(404).json({ message: 'Detalle de receta no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar el detalle de receta:', error);
        res.status(500).send(error.message);
    }
};

//eliminar
// Eliminar un paciente por ID
const deletePaciente = async (req, res) => {
    try {
        const result = await Paciente.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ message: '¡Paciente eliminado correctamente!' });
        } else {
            res.status(404).json({ message: 'Paciente no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el paciente:', error);
        res.status(500).send(error.message);
    }
};
// Eliminar un doctor por ID
const deleteDoctor = async (req, res) => {
    try {
        const result = await Doctor.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ message: '¡Doctor eliminado correctamente!' });
        } else {
            res.status(404).json({ message: 'Doctor no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el doctor:', error);
        res.status(500).send(error.message);
    }
};
// Eliminar un detalle de receta por ID
const deleteDetalleReceta = async (req, res) => {
    try {
        const result = await DetalleReceta.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ message: '¡Detalle de receta eliminado correctamente!' });
        } else {
            res.status(404).json({ message: 'Detalle de receta no encontrado' });
        }
    } catch (error) {
        console.error('Error al eliminar el detalle de receta:', error);
        res.status(500).send(error.message);
    }
};

export const methods = { 
    getAllPacientes,
    getAllDoctores,
    getAllDetalleRecetas,

    getPaciente,
    getDoctor,
    getDetalleReceta,

    createPaciente,
    createDoctor,
    createDetalleReceta,

    updatePaciente,
    updateDoctor,
    updateDetalleReceta,

    deletePaciente,
    deleteDoctor,
    deleteDetalleReceta
};
