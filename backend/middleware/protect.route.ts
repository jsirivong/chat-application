import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import { sql } from "../services/database";

// protects route by validating json web token saved in the client's browser
export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({success: false, message: "Unauthorized. Token does not exist."});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as jwt.Secret);

        if (!decoded){
            return res.status(401).json({success: false, message: "Unauthorized. Invalid token."});
        }

        const user = await sql`SELECT * EXCEPT password FROM Users WHERE id=${decoded.sub}`;

        if (!user) {
            return res.status(401).json({success: false, message: "Unauthorized. User not found in database."});
        }

        req["user"] = user;

        next()
    } catch (err){
        console.log("Error in protectRoute middleware\n", err);
        next(err)
    }
}