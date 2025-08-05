import express from "express";
import cors from 'cors';
import morgan from 'morgan'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.listen(PORT, ()=>{
    console.log(`Server is running on localhost:${PORT}\nServer is listening on port ${PORT}`);
}).on("error", (err)=>{
    console.log("Server start was unsuccessful.\n", err);
})