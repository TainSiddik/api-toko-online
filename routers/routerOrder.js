import express from "express"
import { getOrdersByUser, createOrder } from "../controllers/controllerOrder.js"


const router = express.Router()

router.post('/order', createOrder)
router.get('/order/:user_id', getOrdersByUser)

export default router