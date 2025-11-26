import express, {Request, Response, NextFunction} from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true }))
app.use(cors())

app.post("/login", (req : Request, resp : Response) => {
  
})

app.get("/profile", (req : Request, resp : Response) => {
  
})

//ENDPOINT PARA LA TRANSMISIÓN EN VIVO
app.get("/api/live-url", (req: Request, res: Response) => {
  const liveUrl = process.env.LIVE_EMBED_URL

  if (!liveUrl) {
    return res.status(500).json({ error: "LIVE_EMBED_URL no está configurada" })
  }

  res.json({ url: liveUrl })
})

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Backend escuchando en el puerto ${PORT}`)
})