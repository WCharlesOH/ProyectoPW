import express, {Request, Response, NextFunction} from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import cors from "cors"

dotenv.config() 
const app = express()
const PORT = process.env.PORT

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended : true
}))
app.use(cors())

app.post("/login", (req : Request, resp : Response) => {
    
})

app.get("/profile", (req : Request, resp : Response) => {
    
})
