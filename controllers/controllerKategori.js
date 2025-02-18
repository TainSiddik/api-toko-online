import Kategori from "../models/modelKategori.js"

// Get all data kategori
export const getAllKategori = async (req, res) => {
    try {
        const allKategori = await Kategori.findAll() //cari semua data kategori

        //jika kategori belum ada / kosong
        if (allKategori.length === 0) {
            return res.status(200).json({
                message: "Belum ada kategori"
            })
        }

        // tampilkan semua data kategori
        res.status(200).json(allKategori)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "internal server error" })
    }
}


// Tambah Kategori
export const addKategori = async (req, res) => {
    try {
        const kategori = req.body.kategori.replace(/[^a-zA-Z0-9 ]/g, '') //batasi karakter hanya boleh huruf dan angka

        if (!kategori) {
            return res.status(400).json({ message: "kategori harus diisi" }) //field kategori harus diisi
        }

        // cek apakah kategori sudah ada
        const checkKategori = await Kategori.findOne({
            where: {
                kategori
            }
        }) //cari kategori apakah sudah ada
        if (checkKategori) {
            return res.status(400).json({ message: "Kategori sudah ada" }) //batalkan jika kategori sudah ada
        }

        // simpan kategori baru
        const newKategori = await Kategori.create({ kategori })

        // tampilkan data kategori baru yg berhasil di simpan
        res.status(201).json({
            status: "Berhasil",
            message: "Tambah kategori berhasil",
            kategori: newKategori.kategori
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Tambah kategori gagal" })
    }
}


// Edit Kategori
export const editKategori = async (req, res) => {
    try {
        // tangkap kategori berdasarkan id
        const findKategori = await Kategori.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!findKategori) {
            return res.status(404).json({ message: "Kategori tidak di temukan" }) //jika tidak ada
        }

        const kategori = req.body.kategori.replace(/[^a-zA-Z0-9 ]/g, '') //ganti/edit kategori

        // periksa apakah kategori sudah ada
        const checkKategori = await Kategori.findOne({
            where: {
                kategori
            }
        })
        if (checkKategori) {
            return res.status(400).json({ message: "Kategori sudah ada" })
        }

        // update kategori
        const editKategori = await findKategori.update({
            kategori
        })

        // tampilkan data yg di update
        res.status(200).json({
            message: "Edit Kategori Berhasil",
            kategori: editKategori.kategori
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Edit kategori gagal" })
    }
}



// delete kategori
export const hapusKategori = async (req, res) => {
    try {
        // tangkap kategori berdasarkan id
        const findKategori = await Kategori.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!findKategori) {
            return res.status(404).json({ message: "Kategori tidak di temukan" }) //jika tidak ada
        }

        // hapus kategori
        const hapusKategori = await findKategori.destroy()

        // tampilkan kategori yg di hapus
        res.status(200).json({
            kategori: hapusKategori.kategori,
            status: "Dihapus"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Hapus kategori gagal" })
    }
}