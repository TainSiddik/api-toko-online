import db from "../config/database/Connection.js"
import { Sequelize } from "sequelize"
import Produk from "./modelProduk.js"
import User from "./modelUser.js"


const { DataTypes } = Sequelize

const Order = db.define("order", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    alamat: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    catatan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    sub_total: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true
})

Order.belongsTo(Produk, { foreignKey: "produk_id", as: "produk" })
Produk.hasMany(Order, { foreignKey: "produk_id" })

Order.belongsTo(User, { foreignKey: "user_id", as: "user" })
User.hasMany(Order, { foreignKey: "user_id" })

export default Order