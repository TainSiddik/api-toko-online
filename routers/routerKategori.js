import express from "express"
import { getAllKategori, addKategori, editKategori, hapusKategori } from "../controllers/controllerKategori.js"

const router = express.Router()

router.get('/kategori', getAllKategori)
router.post('/kategori', addKategori)
router.patch('/kategori/:id', editKategori)
router.delete('/kategori/:id', hapusKategori)

export default router