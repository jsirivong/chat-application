import express from "express";
import cors from 'cors';
import morgan from 'morgan'
import dotenv from 'dotenv';
import auth from "./routes/auth-route.ts";
import { sql } from "./services/database.ts";
import path from "path";
import cookieparser from 'cookie-parser';
import user from "./routes/user-route.ts";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.resolve("public")));
app.use(cookieparser());
app.use("/api/v1/auth", auth)
app.use("/api/v1/users", user)

const DatabaseConnection = async () => {
    try {
        // todo: add custom email_address type/domain in postgresql OR just any other custom type
        await sql`CREATE TABLE IF NOT EXISTS Users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR(30) NOT NULL,
            last_name VARCHAR(30) NOT NULL,
            email VARCHAR(150) NOT NULL UNIQUE,
            bio VARCHAR(200),
            password VARCHAR(255) NOT NULL CHECK(LENGTH(password) >= 8),
            profile_picture VARCHAR(255) DEFAULT 'public/avatar-placeholder.jpg',
            native_language VARCHAR(100),
            location VARCHAR(100),
            completed_profile BOOLEAN DEFAULT FALSE,
            friends INTEGER[100] DEFAULT '{}'::INTEGER[],
            created_at DATE DEFAULT CURRENT_DATE,
            updated_at DATE
        );`

        // database schema for friend requests
        await sql`CREATE TABLE IF NOT EXISTS friendrequests (
            sender INTEGER NOT NULL,
            recipient INTEGER NOT NULL,
            status TEXT DEFAULT 'pending' CHECK(status='pending' OR status='accepted'),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()        
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