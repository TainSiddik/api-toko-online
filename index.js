import express from "express"
import "dotenv/config"

const app = express()
const port = process.env.APP_PORT

app.use(express.json())

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})