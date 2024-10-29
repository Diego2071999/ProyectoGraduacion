import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";

const Paciente = sequelize.define('Paciente', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    nomfac: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    referencia: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        allowNull: false
    },
    telefono2: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    edad:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nombre_encargado:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'PACIENTE',
    timestamps: false
});

export default Paciente;