import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import DetalleReceta from "./detalleReceta.js";
import Paciente from "./pacienteV2.js";
import Medicamento from "./medicamentos.js"; // Este modelo debe estar definido en otra parte

const Receta = sequelize.define('Receta', {
    DETALLE_RECETA_id: {
        type: DataTypes.INTEGER,
        references: {
            model: DetalleReceta,
            key: 'id'
        }
    },
    MEDICAMENTO_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Medicamento,
            key: 'id'
        }
    },
    PACIENTE_cod: {
        type: DataTypes.INTEGER,
        references: {
            model: Paciente,
            key: 'cod'
        }
    }
}, {
    tableName: 'RECETA',
    timestamps: false
});

Receta.belongsTo(DetalleReceta, { foreignKey: 'DETALLE_RECETA_id' });
Receta.belongsTo(Paciente, { foreignKey: 'PACIENTE_cod' });
Receta.belongsTo(Medicamento, { foreignKey: 'MEDICAMENTO_id' });

export default Receta;
