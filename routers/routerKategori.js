import express from "express"
import { getAllKategori, addKategori, editKategori, hapusKategori } from "../controllers/controllerKategori.js"
import { verifyToken } from "../middleware/verifyToken.js"

const router = express.Router()

router.get('/kategori', getAllKategori)
router.post('/kategori', verifyToken, addKategori)
router.patch('/kategori/:id', verifyToken, editKategori)
router.delete('/kategori/:id', verifyToken, hapusKategori)

export default router