import { type Response } from 'express';
import type RequestUser from "../types/RequestUser.ts";
import { generateStreamToken } from '../services/stream.ts';

export const getStreamToken = (req: RequestUser, res: Response) => {
    try { 
        const token = generateStreamToken(req.user?.id as number);

        res.status(200).json({success: true, token: token});
    } catch (err) {
        console.log("Error in getStreamToken controller.\n", err);
        res.status(500).json({success: false, message: "Internal server error."});
    }
}