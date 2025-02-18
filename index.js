import express from "express"
import fileUpload from "express-fileupload"
import "dotenv/config"
import db from "./config/database/Connection.js"
import kategori from "./routers/routerKategori.js"

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
app.use(fileUpload())

// router
app.use(kategori)

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})