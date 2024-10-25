import sequelize from "../database/database.js";
import DoctorPaciente from '../models/doctorpaciente.js';
import Receta from "../models/recetaV2.js"

import Doctor from "../models/doctorV2.js";
import Paciente from "../models/pacienteV2.js";
import DetalleReceta from "../models/detalleReceta.js";
import medicamento from "../models/medicamentos.js";

// Obtener todas las relaciones Doctor-Paciente
const getAllDoctorPacientes = async (req, res) => {
    try {
        const doctorPacientes = await DoctorPaciente.findAll({
            include: [
                { model: Doctor, as: 'Doctor' }, // Incluir los datos del doctor
                { model: Paciente, as: 'Paciente' } // Incluir los datos del paciente
            ]
        });
        // Mapeamos para remover PACIENTE_cod y DOCTOR_id
        const response = doctorPacientes.map(record => {
            const { PACIENTE_cod, DOCTOR_id, ...data } = record.toJSON(); // Excluir PACIENTE_cod y DOCTOR_id
            return data;
        });
        res.status(200).json(doctorPacientes);
    } catch (error) {
        console.error('Error al obtener las relaciones Doctor-Paciente:', error);
        res.status(500).json({ message: 'Error retrieving doctor-paciente relations' });
    }
};

// Mostrar todas las recetas
const getAllRecetas = async (req, res) => {
    try {
        const recetas = await Receta.findAll({
            include: [
                { model: DetalleReceta, as: 'recetas' }, // Incluir los detalles de la receta
                { model: medicamento, as: 'medicamento' }, // Incluir los datos del medicamento
                { model: Paciente, as: 'Paciente' } // Incluir los datos del paciente
            ]
        });
        res.status(200).json(recetas); // Enviar respuesta con las recetas encontradas
    } catch (error) {
        console.error('Error al obtener las recetas:', error);
        res.status(500).json({ message: 'Error retrieving recetas' });
    }
};


// Obtener una relación Doctor-Paciente por su ID
const getDoctorPaciente = async (req, res) => {
    try {
        const doctorPaciente = await DoctorPaciente.findOne({
            where: { id: req.params.id }
        });
        if (doctorPaciente) {
            res.json(doctorPaciente);
        } else {
            res.status(404).json({ message: 'Relación Doctor-Paciente no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la relación Doctor-Paciente:', error);
        res.status(500).send(error.message);
    }
};
// Mostrar una sola receta por su ID
const getReceta = async (req, res) => {
    try {
        const receta = await Receta.findOne({
            where: { id: req.params.id }, // Buscar por ID
            include: [
                { model: DetalleReceta, as: 'recetas' }, // Incluir los detalles de la receta
                { model: medicamento, as: 'medicamento' }, // Incluir los datos del medicamento
                { model: Paciente, as: 'Paciente' } // Incluir los datos del paciente
            ]
        });
        if (receta) {
            res.json(receta); // Enviar la receta encontrada
        } else {
            res.status(404).json({ message: 'Receta no encontrada' });
        }
    } catch (error) {
        console.error('Error al obtener la receta:', error);
        res.status(500).send(error.message);
    }
};


// Crear una nueva relación Doctor-Paciente
const createDoctorPaciente = async (req, res) => {
    try {
        const { PACIENTE_cod, DOCTOR_id } = req.body;
        
        // Verificar si el paciente existe
        const paciente = await Paciente.findByPk(PACIENTE_cod);
        if (!paciente) {
            return res.status(404).json({ message: 'Paciente no encontrado' });
        }

        // Verificar si el doctor existe
        const doctor = await Doctor.findByPk(DOCTOR_id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor no encontrado' });
        }

        // Solo se crean las relaciones si los ID's son válidos
        await DoctorPaciente.create({ PACIENTE_cod, DOCTOR_id });
        res.json({ message: '¡Relación Doctor-Paciente creada correctamente!' });
        
    }
    catch (error) {
        console.error('Error al crear la relación Doctor-Paciente:', error);
        res.status(500).send(error.message);
    }
};
// Crear una nueva receta
export const createReceta = async (req, res) => {
    try {
        // Crear la receta y devolver el objeto completo
        const nuevaReceta = await Receta.create(req.body);

        // Responder con la receta recién creada, incluyendo el id
        res.status(201).json(nuevaReceta);
    } catch (error) {
        console.error('Error al crear la receta:', error);
        res.status(500).send(error.message);
    }
};


// Actualizar una relación Doctor-Paciente por ID
const updateDoctorPaciente = async (req, res) => {
    try {
        const { PACIENTE_cod, DOCTOR_id } = req.body;

        const result = await DoctorPaciente.update({ PACIENTE_cod, DOCTOR_id }, {
            where: { id: req.params.id }
        });

        if (result[0]) {
            res.json({ message: '¡Relación Doctor-Paciente actualizada correctamente!' });
        } else {
            res.status(404).json({ message: 'Relación Doctor-Paciente no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la relación Doctor-Paciente:', error);
        res.status(500).send(error.message);
    }
};
// Actualizar una receta existente
const updateReceta = async (req, res) => {
    try {
        const result = await Receta.update(req.body, {
            where: { id: req.params.id }
        });
        if (result[0]) {
            res.json({ "message": "¡Receta actualizada correctamente!" });
        } else {
            res.status(404).json({ message: 'Receta no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la receta:', error);
        res.status(500).send(error.message);
    }
};


// Eliminar una relación Doctor-Paciente por ID
const deleteDoctorPaciente = async (req, res) => {
    try {
        const result = await DoctorPaciente.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ message: '¡Relación Doctor-Paciente eliminada correctamente!' });
        } else {
            res.status(404).json({ message: 'Relación Doctor-Paciente no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la relación Doctor-Paciente:', error);
        res.status(500).send(error.message);
    }
};
// Eliminar una receta
const deleteReceta = async (req, res) => {
    try {
        const result = await Receta.destroy({
            where: { id: req.params.id }
        });
        if (result) {
            res.json({ "message": "¡Receta eliminada correctamente!" });
        } else {
            res.status(404).json({ message: 'Receta no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la receta:', error);
        res.status(500).send(error.message);
    }
};
export const methods = { 
    getAllDoctorPacientes,
    getAllRecetas,

    getDoctorPaciente,
    getReceta,

    createDoctorPaciente,
    createReceta,

    updateDoctorPaciente,
    updateReceta,
   
    deleteDoctorPaciente,
    deleteReceta
};