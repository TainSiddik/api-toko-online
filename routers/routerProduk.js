import express from "express"
import { getAllProduk, getAllProdukByKategori, getDetailProduk, createProduk, deleteProduk } from "../controllers/controllerProduk.js"

const router = express.Router()

router.get('/produk', getAllProduk)
router.get('/produk/:kategori_id', getAllProdukByKategori)
router.get('/produk/:kategori_id/:id', getDetailProduk)
router.post('/produk', createProduk)
router.delete('/produk/:kategori_id/:id', deleteProduk)

export default router