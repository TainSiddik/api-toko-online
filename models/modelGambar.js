import db from "../config/database/Connection.js"
import { Sequelize } from "sequelize"
import Produk from "./modelProduk.js"

const { DataTypes } = Sequelize

const Gambar = db.define('gambar', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    freezeTableName: true
}
)

Gambar.belongsTo(Produk, { foreignKey: "produk_id", as: "produk", onDelete: "CASCADE" })
Produk.hasMany(Gambar, { foreignKey: "produk_id", as: "gambar" })

export default Gambar
