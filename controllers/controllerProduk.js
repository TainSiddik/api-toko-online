import Produk from "../models/modelKategori.js"
import Gambar from "../models/modelGambar.js"
import path from "path"
import fs from "fs";

// Fungsi untuk menambahkan produk dengan gambar
export const createProduk = async (req, res) => {
    try {
        const { produk, harga, jumlah, deskripsi, kategori_id } = req.body;

        // Validasi input
        if (!produk || !harga || !jumlah || !deskripsi || !kategori_id) {
            return res.status(400).json({ message: "Semua field harus diisi" });
        }

        // Buat produk baru
        const produkBaru = await Produk.create({
            produk,
            harga,
            jumlah,
            deskripsi,
            kategori_id
        });

        // Cek apakah ada file gambar yang diupload
        if (req.files && req.files.gambar) {
            const gambarFiles = Array.isArray(req.files.gambar) ? req.files.gambar : [req.files.gambar];

            for (let file of gambarFiles) {
                // Simpan file ke folder 'uploads'
                const filename = `${Date.now()}-${file.name}`;
                const uploadPath = path.join("uploads", filename);
                file.mv(uploadPath, async (err) => {
                    if (err) {
                        console.error("Gagal menyimpan gambar:", err);
                        return res.status(500).json({ message: "Gagal menyimpan gambar" });
                    }
                });

                // Simpan path gambar ke database
                await Gambar.create({
                    produk_id: produkBaru.id,
                    url_gambar: `/uploads/${filename}` // Simpan path-nya
                });
            }
        }

        res.status(201).json({
            message: "Produk berhasil ditambahkan",
            produk: produkBaru
        });

    } catch (error) {
        console.error("Error saat menambahkan produk:", error);
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
};
