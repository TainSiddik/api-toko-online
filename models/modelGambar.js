import db from "../config/database/Connection.js";
import { DataTypes } from "sequelize";
import Produk from "./modelProduk.js"; // Import model Produk

const Gambar = db.define("gambar", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    produk_id: { // Foreign Key ke Produk
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Produk,
            key: "id"
        }
    },
    url_gambar: { // Simpan URL/path gambar
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

// Relasi: 1 Produk bisa punya banyak Gambar
Produk.hasMany(Gambar, { foreignKey: "produk_id", onDelete: "CASCADE" });
Gambar.belongsTo(Produk, { foreignKey: "produk_id" });

export default Gambar;
