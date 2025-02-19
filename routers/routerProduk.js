import express from "express"
import { getAllProduk, createProduk } from "../controllers/controllerProduk.js"

const router = express.Router()

router.get('/produk', getAllProduk)
router.post('/produk', createProduk)

export default router