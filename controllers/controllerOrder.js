import Order from "../models/modelOrder.js"
import Produk from "../models/modelProduk.js"
import User from "../models/modelUser.js"

export const getOrdersByUser = async (req, res) => {
    try {
        console.log(req.user); // Cek apakah user_id sudah ada
        const user_id = req.user?.id; // Ambil user_id dari token

        if (!user_id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }

        const orders = await Order.findAll({
            where: { user_id },
            include: [
                {
                    model: Produk,
                    as: "produk",
                    attributes: ["produk", "harga"],
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
};



export const createOrder = async (req, res) => {
    try {
        const user_id = req.user?.id; // Ambil user_id dari token
        const { produk_id, jumlah, alamat, catatan } = req.body;

        if (!user_id || !produk_id || !jumlah || !alamat) {
            return res.status(400).json({ message: "Semua data harus diisi" });
        }

        // Cek apakah produk tersedia
        const produk = await Produk.findByPk(produk_id);
        if (!produk) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
        }

        // Cek stok produk
        if (produk.stok < jumlah) {
            return res.status(400).json({ message: "Stok tidak mencukupi" });
        }

        // Hitung total harga
        const sub_total = produk.harga * jumlah;
        console.log("Sub Total:", sub_total)

        // Buat order baru
        const order = await Order.create({
            user_id,
            produk_id,
            jumlah,
            alamat,
            catatan,
            sub_total, // dihitung otomatis
        });

        // Kurangi stok produk setelah order dibuat
        await produk.update({
            stok: produk.stok - jumlah,
            terjual: (produk.terjual || 0) + jumlah
        })

        res.status(201).json({ message: "Order berhasil dibuat", order });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};
