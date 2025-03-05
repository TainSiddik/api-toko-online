import express from "express"
import { verifyToken } from "../middleware/verifyToken.js"
import { getOrdersByUser, createOrder } from "../controllers/controllerOrder.js"


const router = express.Router()

router.post('/order', verifyToken, createOrder)
router.get('/order', verifyToken, getOrdersByUser)

export default router