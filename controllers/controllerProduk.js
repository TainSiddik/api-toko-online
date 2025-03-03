import Produk from "../models/modelProduk.js"
import Gambar from "../models/modelgambar.js"
import Kategori from "../models/modelKategori.js"
import path from "path"
import fs from "fs"

// get all data produk
export const getAllProduk = async (req, res) => {
    try {
        const produk = await Produk.findAll({
            include: [
                {
                    model: Kategori,
                    attributes: ["kategori"],
                    as: "kategori"
                },
                {
                    model: Gambar,
                    attributes: ["url"],
                    as: "gambar",
                }
            ],
            attributes: { exclude: ["createdAt", "updatedAt"] }
        });

        if (produk.length === 0) {
            return res.status(200).json({ message: "Belum ada produk" })
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const produkFinal = produk.map((p) => ({
            ...p.toJSON(),
            gambar: p.gambar.map((g) => ({
                ...g,
                url: `${baseUrl}${g.url}`, // Tambahkan domain backend
            }))
        }));

        res.status(200).json(produkFinal);
    } catch (error) {
        console.error("Error mengambil produk:", error)
        res.status(500).json({ message: `Terjadi kesalahan server ${error}` })
    }
}

// get all data by kategori
export const getAllProdukByKategori = async (req, res) => {
    try {
        const produk = await Produk.findAll({
            where: {
                kategori_id: req.params.kategori_id
            },
            include: [
                {
                    model: Kategori,
                    attributes: ["kategori"],
                    as: "kategori"
                },
                {
                    model: Gambar,
                    attributes: ["url"],
                    as: "gambar"
                }
            ],
            attributes: { exclude: ["id", "createdAt", "updatedAt", "kategori_id"] }
        })
        if (!produk) {
            return res.status(404).json({ message: "produk tidak ditemukan" })
        }
        res.status(200).json(produk)
    } catch (error) {
        console.error("Error mengambil produk:", error)
        res.status(500).json({ message: `Terjadi kesalahan server ${error}` })
    }
}


// get one data produk
export const getDetailProduk = async (req, res) => {
    try {
        const produk = await Produk.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {
                    model: Kategori,
                    attributes: ["kategori"],
                    as: "kategori"
                },
                {
                    model: Gambar,
                    attributes: ["url"],
                    as: "gambar"
                }
            ],
            attributes: { exclude: ["id", "createdAt", "updatedAt", "kategori_id"] }
        })
        if (!produk) {
            return res.status(404).json({ message: "produk tidak ditemukan" })
        }
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const produkFinal = {
            ...produk.toJSON(),
            gambar: produk.gambar.map((g) => ({
                ...g,
                url: `${baseUrl}${g.url}` // Tambahkan domain backend
            }))
        };

        res.status(200).json(produkFinal);
    } catch (error) {
        console.error("Error mengambil produk:", error)
        res.status(500).json({ message: `Terjadi kesalahan server ${error}` })
    }
}


// create new produk
export const createProduk = async (req, res) => {
    try {
        const { produk, harga, stok, deskripsi, kategori } = req.body;

        // Validasi input
        if (!produk || !harga || !stok || !deskripsi || !kategori) {
            return res.status(400).json({ message: "Semua field harus diisi" })
        }

        // Cari kategori berdasarkan nama
        let namaKategori = await Kategori.findOne({ where: { kategori: kategori } })

        if (!namaKategori) {
            namaKategori = await Kategori.create({ kategori: kategori });
        }

        // Buat produk baru
        const produkBaru = await Produk.create({
            produk,
            harga,
            stok,
            deskripsi,
            kategori_id: namaKategori.id
        });

        // Cek apakah ada file gambar yang diupload
        if (req.files && req.files.gambar) {
            const gambarFiles = Array.isArray(req.files.gambar) ? req.files.gambar : [req.files.gambar];

            // Simpan semua gambar
            const gambarPromises = gambarFiles.map((file) => {
                return new Promise((resolve, reject) => {
                    const filename = `${Date.now()}-${file.name}`;
                    const uploadPath = path.join("public/img/produk", filename)

                    file.mv(uploadPath, async (err) => {
                        if (err) {
                            console.error("Gagal menyimpan gambar:", err);
                            reject(err);
                        } else {
                            try {
                                // Simpan path gambar ke database
                                const gambarBaru = await Gambar.create({
                                    produk_id: produkBaru.id,
                                    url: `/img/produk/${filename}`
                                });
                                resolve(gambarBaru);
                            } catch (dbError) {
                                reject(dbError);
                            }
                        }
                    });
                });
            });

            // Tunggu semua gambar selesai disimpan
            await Promise.all(gambarPromises);
        }

        // Ambil kembali produk dengan relasi kategori
        const produkFinal = await Produk.findOne({
            where: { id: produkBaru.id },
            include: [
                {
                    model: Kategori,
                    attributes: ["kategori"],
                    as: "kategori"
                },
                {
                    model: Gambar,
                    attributes: ["url"],
                    as: "gambar"
                }
            ],
            attributes: { exclude: ["id", "kategori_id"] }
        });

        res.status(201).json({
            message: "Produk berhasil ditambahkan",
            produk: produkFinal
        });

    } catch (error) {
        console.error("Error saat menambahkan produk:", error);
        res.status(500).json({ message: `Terjadi kesalahan server ${error}` });
    }
}



// delete produk
export const deleteProduk = async (req, res) => {

}