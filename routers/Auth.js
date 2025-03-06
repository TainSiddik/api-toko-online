import express from "express"
import { register, login, refreshToken, profile, logout } from "../controllers/Auth.js"
import { verifyToken } from "../middleware/verifyToken.js"


const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/token', verifyToken, refreshToken)
router.get('/profile', verifyToken, profile)
router.delete('/logout', verifyToken, logout)

export default router