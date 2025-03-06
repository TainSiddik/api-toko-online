import express from "express"
import fileUpload from "express-fileupload"
import cors from "cors"
import "dotenv/config"
import db from "./config/database/Connection.js"
import kategori from "./routers/routerKategori.js"
import produk from "./routers/routerProduk.js"
import auth from "./routers/Auth.js"
import order from "./routers/routerOrder.js"
import payment from "./routers/routerPayment.js"

const app = express()
const port = process.env.APP_PORT

const dbSync = async () => {
    try {
        await db.authenticate()
        console.log("Datebase has connected")
        // await db.sync({ alter: true })
    } catch (error) {
        console.log(`Database connection has failed ${error}`)
    }
}
dbSync()

app.use(express.json())
app.use(express.static("public"))
app.use(fileUpload())
app.use(cors())

// router
app.use('/api', kategori)
app.use('/api', produk)
app.use('/api', auth)
app.use('/api', order)
app.use("/api/payment", payment);


app.listen(port, () => {
    console.log(`server running on port ${port}`)
})