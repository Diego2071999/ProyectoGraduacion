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
    const latestCliente = await Clientes.findOne({
        order: [['codclie', 'DESC']]
    });

    let nextCod = 1; // Valor inicial
    if (latestCliente) {
        const lastCod = latestCliente.codclie;
        const numberPart = parseInt(lastCod.substring(1)); // Obtener la parte numérica
        nextCod = numberPart + 1; // Incrementar el número
    }

    const newCodclie = `C${nextCod}`;
    console.log('Next codclie generated:', newCodclie); // Añadir log para depuración
    return newCodclie; // Retornar el nuevo codclie
};

export default  Clientes

export  { generateCodclie };