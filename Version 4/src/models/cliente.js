import sequelize from "../database/database.js";
import { DataTypes } from 'sequelize';

const Clientes = sequelize.define('cliente', {
    NIT: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true
    },
    nombre_en_factura: {
        type: DataTypes.STRING,
        allowNull: false
    },
    direccion_de_entrega: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    referencia: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    telefono2: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    codclie: {
        type: DataTypes.STRING, // Cambiar a STRING para permitir formato alfanumérico
        allowNull: true
    }
}, {
    tableName: 'cliente',
    timestamps: false
});

// Función para generar codclie en formato "C123"
const generateCodclie = async () => {
    // Obtener el cliente con el último codclie
    const latestCliente = await Clientes.findOne({
        order: [['codclie', 'DESC']] // Ordenar por codclie en orden descendente
    });

    // Si no hay clientes en la base de datos, comenzamos con C1001
    let nextCodclie = 1001;
    if (latestCliente) {
        // Extraer el número del último codclie y sumarle 1
        const lastCodclie = parseInt(latestCliente.codclie.replace('C', ''));
        nextCodclie = lastCodclie + 1;
    }

    // Formatear el codclie con el prefijo "C"
    return `C${nextCodclie}`;
};

export default  Clientes

export  { generateCodclie };