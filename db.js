import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})  

connection.connect((err)=> {
    if(err) {
        console.log('DB connection failed:', err.stack)
        return; 
    }
    console.log('DB connected sccessfully')
});

export default connection