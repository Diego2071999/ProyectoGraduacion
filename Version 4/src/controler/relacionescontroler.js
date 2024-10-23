import sequelize from "../database/database.js";
import DoctorPaciente from '../models/DoctorPaciente.js';

// Obtener todas las relaciones Doctor-Paciente
const getAllDoctorPacientes = async (req, res) => {
    try {
        const doctorPacientes = await DoctorPaciente.findAll();
        res.status(200).json(doctorPacientes);
    } catch (error) {
        console.error('Error al obtener las relaciones Doctor-Paciente:', error);
        res.status(500).json({ message: 'Error retrieving doctor-paciente relations' });
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

// Crear una nueva relación Doctor-Paciente
const createDoctorPaciente = async (req, res) => {
    try {
        const { PACIENTE_cod, DOCTOR_id } = req.body;
        
        // Solo se crean las relaciones si los ID's son válidos
        await DoctorPaciente.create({ PACIENTE_cod, DOCTOR_id });
        res.json({ message: '¡Relación Doctor-Paciente creada correctamente!' });
    } catch (error) {
        console.error('Error al crear la relación Doctor-Paciente:', error);
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

export const methods = { 
    getAllDoctorPacientes,

    getDoctorPaciente,

    createDoctorPaciente,

    updateDoctorPaciente,
   
    deleteDoctorPaciente
};