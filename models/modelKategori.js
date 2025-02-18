import db from "../config/database/Connection.js"
import { Sequelize } from "sequelize"

const { DataTypes } = Sequelize

const Kategori = db.define('kategori', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    kategori: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
}
)
export default Kategori
