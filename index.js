import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connection from "./db.js"
import router from "./routes/schoolsRoutes.js"


dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000
 
app.use(cors());
app.use(express.json())

app.use('/api',router)


app.listen(PORT, ()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})