import express from "express"
import { getAllProduk } from "../controllers/controllerProduk.js"

const router = express.Router()

router.get('/produk', getAllProduk)

export default router