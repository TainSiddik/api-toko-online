import midtrans from "../config/payment/midtransConfig.js";
import Order from "../models/modelOrder.js";
import User from "../models/modelUser.js";

export const createPayment = async (req, res) => {
    try {
        const user_id = req.user?.id;
        const { order_id } = req.body;

        if (!user_id || !order_id) {
            return res.status(400).json({ message: "User ID dan Order ID harus diisi" });
        }

        // Ambil data order
        const order = await Order.findOne({
            where: { id: order_id, user_id },
            include: { model: User, as: "user", attributes: ["name", "email"] }
        });

        if (!order) {
            return res.status(404).json({ message: "Order tidak ditemukan" });
        }

        // Buat parameter transaksi Midtrans
        const parameter = {
            transaction_details: {
                order_id: order.id,
                gross_amount: order.sub_total, // Total harga order
            },
            customer_details: {
                first_name: order.user.name,
                email: order.user.email,
            },
        };

        // Generate Snap Token dari Midtrans
        const transaction = await midtrans.createTransaction(parameter);
        const snapToken = transaction.token;

        res.status(200).json({ message: "Snap Token berhasil dibuat", snapToken });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan", error: error.message });
    }
};
