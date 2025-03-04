import Order from "../models/modelOrder.js"
import Produk from "../models/modelProduk.js"
import User from "../models/modelUser.js"

export const getOrdersByUser = async (req, res) => {
    try {
        const { user_id } = req.params; // Ambil user_id dari URL

        const orders = await Order.findAll({
            where: { user_id },
            include: [
                {
                    model: Produk,
                    as: "produk",
                    attributes: ["produk", "harga"],
                },
                {
                    model: User,
                    as: "user",
                    attributes: ["name"],
                },
            ],
            attributes: { exclude: ["produk_id", "user_id", "createdAt", "updatedAt"] }
        });

        if (!orders.length) {
            return res.status(404).json({ message: "Belum ada order" });
        }

        res.status(200).json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
}


export const createOrder = async (req, res) => {
    try {
        const { user_id, produk_id, jumlah, alamat, catatan, sub_total } = req.body;

        // Validasi input
        if (!user_id || !produk_id || !jumlah || !alamat || !sub_total) {
            return res.status(400).json({ message: "Semua data harus diisi" });
        }

        const order = await Order.create({
            user_id,
            produk_id,
            jumlah,
            alamat,
            catatan,
            sub_total,
        });

        res.status(201).json({ message: "Order berhasil dibuat", order });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};