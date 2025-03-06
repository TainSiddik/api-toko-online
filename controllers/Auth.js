import User from "../models/modelUser.js"
import bcrypt from "bcrypt"
import "dotenv/config"
import jwt from "jsonwebtoken"

// register
export const register = async (req, res) => {
    const { name, email, password, confPassword } = req.body

    const cleanedName = name.trim().replace(/[^a-zA-Z0-9\s'-]/g, '')

    const image = "default.webp"
    const role = "user"

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid Format Email" })
    }

    const checkEmail = await User.findOne({
        where: {
            email: email
        }
    })
    if (checkEmail) {
        return res.status(400).json({
            message: "Email has used"
        })
    }

    if (password !== confPassword) {
        return res.status(400).json({
            message: "Password dan Confirm Password not match"
        })
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must have at least 6 characters"
        })
    }

    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)

    try {
        const user = await User.create({
            name: cleanedName,
            email: email,
            password: hashPassword,
            role: role,
            image: image
        })
        res.status(201).json({
            status: "Success",
            message: "Register Berhasil",
            data: {
                name: user.name,
                email: user.email
            }
        })
    } catch (error) {
        res.status(400).json({ message: "Register gagal", error })
    }
}

// login
export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(400).json({ message: "wrong password" })
        }

        const userId = user.id
        const userEmail = user.email
        const accessToken = jwt.sign({ userId, userEmail }, process.env.ACCESS_TOKEN, { expiresIn: "1h" })
        const refreshToken = jwt.sign({ userId, userEmail }, process.env.REFRESH_TOKEN, { expiresIn: "12h" })

        await user.update({ refresh_token: refreshToken })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
            // secure: true
        })

        res.json({
            status: "Success",
            message: "Login Successfully",
            accessToken
        })

    } catch (error) {
        res.status(500).json({
            status: "Internal Server Error",
            message: "Login gagal",
            error: error.message
        })
    }
}


// Refresh Token
export const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Refresh Token tidak ditemukan. Pastikan anda sudah login"
            })
        }
        const user = await User.findOne({
            where: {
                refresh_token: token
            }
        })
        if (!user) {
            return res.status(403).json({
                status: "error",
                message: "Token tidak valid atau sudah kadaluarsa. Silahkan login kembali."
            })
        }
        jwt.verify(token, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    status: "error",
                    message: "Token kadaluarsa atau tidak valid. Silahkan login kembali.",
                    error: err
                })
            }

            const userId = user.id
            const userEmail = user.email

            const accessToken = jwt.sign({ userId, userEmail }, process.env.ACCESS_TOKEN, { expiresIn: "1h" })

            res.json({
                status: "Success",
                message: "Get new access token",
                accessToken
            })
        })
    } catch (error) {
        console.log(error)

        res.status(500).json({
            status: "error",
            message: "Terjadi kesalahan pada server. Coba lagi nanti."
        })
    }
}

// me
export const profile = async (req, res) => {
    try {
        const token = req.cookies.refreshToken
        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Refresh Token tidak ditemukan. Pastikan anda sudah login"
            })
        }
        const user = await User.findOne({
            where: {
                refresh_token: token
            },
            attributes: ["name", "email", "image", "role"]
        })
        if (!user) {
            return res.status(403).json({
                status: "error",
                message: "Token tidak valid atau sudah kadaluarsa. Silahkan login kembali."
            })
        }
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({
            status: "Internal Server Error",
            message: "Get data user has failed",
            error: error.message
        })
    }
}


// logout
export const logout = async (req, res) => {
    const token = req.cookies.refreshToken
    try {
        if (!token) {
            return res.sendStatus(401)
        }
        const user = await User.findOne({
            where: {
                refresh_token: token
            }
        })
        if (!user) {
            return res.sendStatus(204)
        }
        await user.update({ refresh_token: null })
        res.clearCookie('refreshToken')
        return res.status(200).json({
            message: "Success",
            status: "Logout"
        })
    } catch (error) {
        res.status(500).json({
            status: "Internal Server Error",
            message: "Logout has failed",
            error: error.message
        })
    }
}