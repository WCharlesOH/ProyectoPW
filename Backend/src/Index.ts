import express, {Request, Response, NextFunction} from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"
import { PrismaClient } from "./generated/prisma/client"


dotenv.config() 
const app = express()
const PORT = process.env.PORT

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(cors())

app.post("/Usuario", (req : Request, resp : Response) => {
    
})

app.get("/UsuariosRanking", (req : Request, resp : Response) => {
    
})
