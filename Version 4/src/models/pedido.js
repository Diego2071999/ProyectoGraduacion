import sequelize from "../database/database.js";
import { DataTypes } from "sequelize";
import DetallePedido from "./detallepedido.js";
import Receta from "./recetaV2.js";

const Pedido = sequelize.define('Pedido', {
    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    DETALLE_PEDIDO_id: {
        type: DataTypes.INTEGER,
        references: {
            model: DetallePedido,
            key: 'id'
        }
    },
    RECETA_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Receta,
            key: 'id'
        }
    }
}, {
    tableName: 'PEDIDO',
    timestamps: false
});

Pedido.belongsTo(DetallePedido, { foreignKey: 'DETALLE_PEDIDO_id'});
Pedido.belongsTo(Receta, { foreignKey: 'RECETA_id', as: 'recetas'  });

export default Pedido;
