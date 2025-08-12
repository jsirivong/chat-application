import { type Request, type Response } from 'express';
import { sql } from '../../services/database.ts';
import { hashPassword, comparePassword } from '../../services/passwordhash.ts';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type User from '../../types/User.ts';
import { upsertStreamUser } from '../../services/stream.ts';
import type RequestUser from '../../types/RequestUser.ts';
import type { RegisterData, LoginData, CompleteProfileData } from './auth.types.ts';


const validateEmailFormat = (email: string): boolean => {
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(email);
}

const validateEmailUniqueness = async (email: string): Promise<boolean> => {
    let user = {}
    
    try {
        [user] = await sql`SELECT * FROM Users WHERE email=${email}` as User[];
    } catch (err) {
        console.log("Error in validating unique email.\n", err)
    }

    if (!user){ 
        return true;
    }   

    return false;
}

export const register = async (req: Request, res: Response) => {
    const { first_name, last_name, email, password }: RegisterData = req.body;

    try {
        if (!email || !first_name || !last_name || !password){
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

        const capitalized_first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
        const capitalized_last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);

        const user = await sql`INSERT INTO Users (first_name, last_name, email, password) VALUES (${capitalized_first_name}, ${capitalized_last_name}, ${email}, ${await hashPassword(password)}) RETURNING *` as User[];

        // create new Stream User
        try {
            await upsertStreamUser({
            id: `${user[0].id}`,
            name: `${capitalized_first_name} ${capitalized_last_name}`,
            image: user[0].profile_picture
        })
        } catch (err) {
            console.error("Error creating Stream user", err);
        }

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
        res.status(500).json({success: false, message: `User creation failed.`})
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password }: LoginData = req.body;

        if (!email || !password) {
            return res.status(400).json({success: false, message: "All fields are required"});
        }

        // checks if a user in the database has the entered email
        const [user] = await sql`SELECT * FROM Users WHERE email=${email}` as User[];

        if (!user || !await comparePassword(password, user.password)) {
            return res.status(401).json({success: false, message: "Email or password not found."});
        }

        const payload: JwtPayload = {
            sub: `${user.id}`, // subject - unique identifier - commonly the id of the entity
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
    } catch (err: any){
       console.log("User login failed in login controller.\n", err);
       res.status(500).json({success: false, message: `User login failed. ${err}`})
    }
}

export const logout = (req: Request, res: Response) => {
    // clear json web token cookies

    // to clear a cookie, you use the clearCookie() method on the response object
    res.clearCookie("token");
    res.status(200).json({success: true, message: "Successfully logged out"});
}

export const completeProfile = async (req: RequestUser, res: Response) => {
    try {
        const id = req.user?.id;

        const { first_name, last_name, bio, native_language, location }: CompleteProfileData = req.body;

        const capitalized_first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
        const capitalized_last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);

        if (!first_name || !last_name || !bio || !native_language || !location){
            return res.status(400).json({success: false, message: "All fields are required", missingFields: [
                !first_name && "first_name",
                !last_name && "last_name",
                !bio && "bio",
                !native_language && "native_language",
                !location && "location"
            ].filter(Boolean)});
        }

        const user = await sql`UPDATE Users SET first_name=${capitalized_first_name}, last_name=${capitalized_last_name}, bio=${bio}, native_language=${native_language}, location=${location}, completed_profile=true WHERE id=${id} RETURNING *;` as User[];

        if (!user) return res.status(404).json({success: false, message: "User not found."});

        await upsertStreamUser({id: String(id), name: capitalized_first_name + " " + capitalized_last_name, image: user[0].profile_picture});

        res.status(200).json({success: true, data: user[0]})
    } catch (err){
        console.log("Error completing profile.\n", err);
        res.status(500).json({success: false, message: "Internal server error."});
    }
}