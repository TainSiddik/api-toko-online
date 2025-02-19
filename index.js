import express from "express"
import fileUpload from "express-fileupload"
import "dotenv/config"
import db from "./config/database/Connection.js"
import kategori from "./routers/routerKategori.js"
import produk from "./routers/routerProduk.js"

const app = express()
const port = process.env.APP_PORT

const dbSync = async () => {
    try {
        await db.authenticate()
        console.log("Datebase has connected")
        // await db.sync({ force: true })
    } catch (error) {
        console.log(`Database connection has failed ${error}`)
    }
}
dbSync()

app.use(express.json())
app.use(express.static("public"))
app.use(fileUpload())

// router
app.use('/api', kategori)
app.use('/api', produk)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})