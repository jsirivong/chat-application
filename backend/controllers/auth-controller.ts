import { type Request, type Response } from 'express';
import { sql } from '../services/database.ts';
import { hashPassword, comparePassword } from '../services/passwordhash.ts';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type User from '../types/User.ts';

interface RegisterData {
    [key: string]: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

const validateEmailFormat = (email: string): boolean => {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
}

const validateEmailUniqueness = async (email: string): Promise<boolean> => {
    let user: User[] = [];
    
    try {
        user = await sql`SELECT * FROM Users WHERE email=${email}` as User[];
    } catch (err) {
        console.log("Error in validating unique email.\n", err)
    }

    if (!user){ 
        return false;
    }   

    return true;
}

export const register = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password }: RegisterData = req.body;

    try {
        if (!email || !lastName || !firstName || !password){
            return res.status(400).json({success: false, message: "Please provide valid credentials."});
        }

        if (password.length < 8){
            return res.status(400).json({success: false, message: "Length of password must have at least 8 characters."});
        }

        if (!validateEmailFormat(email)){
            return res.status(400).json({success: false, message: "Provide a valid email address format."});
        }

        if (!await validateEmailUniqueness(email)){
            return res.status(400).json({success: false, message: "Email is already taken."});
        }

        const user = await sql`INSERT INTO Users (first_name, last_name, email, password) VALUES (${firstName}, ${lastName}, ${email}, ${await hashPassword(password)}) RETURNING *` as User[];

        const payload: JwtPayload = {
            sub: `${user[0].id}`, // subject - unique identifier
        };

        const options: jwt.SignOptions = {
            expiresIn: "1d" // automatically adds the "iat" and "exp" claims in the payload
        };

        // create JSON Web Token and return it to client, so user has authorization to use the server's resources
        const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY as jwt.PrivateKey, options)

        // first argument is the cookie name, second is the cookie value (what the cookie is storing), third is the cookie options
        // sets the cookie in the client's browser
        res.cookie("token", token, {
            httpOnly: true, // prevents XSS attacks
            secure: process.env.NODE_ENV==="production", // use HTTPS, will only be true in production
            sameSite: "strict", // prevent CSRF attacks
            maxAge: 1000 * 60 * 60 * 24, // one day in milliseconds
        })

        res.status(201).json({success: true, data: user});
    } catch (err) {
        // runs when there is an error validating user's credentials
        console.log("User creation failed in register controller.\n", err);
        res.status(500).json({success: false, message: `User creation failed. ${err}`})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password }: LoginData = req.body;

        if (!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        // checks if a user in the database has the entered email
        const user = await sql`SELECT * FROM Users WHERE email=${email}` as User[];

        if (!user || await !comparePassword(password, user[0].password)) {
            return res.status(401).json({success: false, message: "Email or password not found. Not authorized for the requested resource."});
        }

        const payload: JwtPayload = {
            sub: `${user[0].id}`, // subject - unique identifier
        };

        const options: jwt.SignOptions = {
            expiresIn: "1d" // automatically adds the "iat" and "exp" claims in the payload
        };

        // create JSON Web Token and return it to client, so user has authorization to use the server's resources
        const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY as jwt.PrivateKey, options)

        // sets the cookie in the client's browser
        res.cookie("token", token, {
            httpOnly: true, // prevents XSS attacks
            secure: process.env.NODE_ENV==="production", // use HTTPS, will only be true in production
            sameSite: "strict", // prevent CSRF attacks
            maxAge: 1000 * 60 * 60 * 24, // one day in milliseconds
        })

        res.status(200).json({success: true, data: user});
    } catch (err){
       console.log("User login failed in login controller.\n", err);
       res.status(500).json({success: false, message: `User login failed. ${err}`})
    }
}

export const logout = (req: Request, res: Response) => {
    // clear jwt cookies

    res.clearCookie("token");
    res.status(200).json({success: true, message: "Successfully logged out"});
}