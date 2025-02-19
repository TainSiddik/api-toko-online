import Produk from "../models/modelProduk.js"
import Gambar from "../models/modelgambar.js"

export const getAllProduk = async (req, res) => {
    try {
        const produk = await Produk.findAll({
            include: [
                {
                    model: Gambar, // Tidak perlu alias
                    attributes: ["id", "url"]
                }
            ]
        });

        if (produk.length === 0) {
            return res.status(200).json({ message: "Belum ada produk" });
        }

        res.status(200).json(produk);
    } catch (error) {
        console.error("Error mengambil produk:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
}