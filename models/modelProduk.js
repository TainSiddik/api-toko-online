import db from "../config/database/Connection.js"
import { Sequelize } from "sequelize"
import Kategori from "./modelKategori.js"

const { DataTypes } = Sequelize

const Produk = db.define('produk', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    produk: {
        type: DataTypes.STRING,
        allowNull: false
    },
    harga: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    freezeTableName: true
}
)

Produk.belongsTo(Kategori, { foreignKey: "kategori_id", as: "kategori" })
Kategori.hasMany(Produk, { foreignKey: "kategori_id" })

export default Produk
