import { type Response, type NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { sql } from "../services/database.ts";
import type User from "../types/User.ts";
import type RequestUser from "../types/RequestUser.ts";

// protects route by validating json web token saved in the client's browser
export const authorizeUser = async (req: RequestUser, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({success: false, message: "Unauthorized. Token does not exist."});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as jwt.Secret);

        if (!decoded){
            return res.status(401).json({success: false, message: "Unauthorized. Invalid token."});
        }

        const user = await sql`SELECT id, first_name, last_name, email, bio, profile_picture, native_language, location, completed_profile, friends FROM Users WHERE id=${decoded.sub}` as User[];

        if (!user) {
            return res.status(401).json({success: false, message: "Unauthorized. User not found in database."});
        }

        req.user = user[0];

        next()
    } catch (err){
        console.log("Error in protectRoute middleware\n", err);
        next(err)
    }
}