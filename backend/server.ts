import express from "express";
import cors from 'cors';
import morgan from 'morgan'
import dotenv from 'dotenv';
import auth from "./routes/auth-route.ts";
import { sql } from "./services/database.ts";
import path from "path";
import cookieparser from 'cookieparser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.resolve("public")));
app.use("/api/v1/auth", auth)

const DatabaseConnection = async () => {
    try {
        await sql`CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL CHECK(LENGTH(password) >= 8),
            profile_picture VARCHAR(255) DEFAULT 'public/avatar-placeholder.jpg',
            native_language VARCHAR(100),
            location VARCHAR(100),
            is_on_boarded BOOLEAN DEFAULT FALSE,
            friends INTEGER[100],
            created_at DATE DEFAULT CURRENT_DATE,
            updated_at DATE
        );`;
        console.log("Successfully connected to database.");
    } catch (err) {
        console.log("Error in connecting to database.\n", err);
    }
}

DatabaseConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on localhost:${PORT}\nServer is listening on port ${PORT}`);
    }).on("error", (err) => {
        console.log("Server start was unsuccessful.\n", err);
    })
})