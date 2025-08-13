import express, { type Response } from 'express';
import { login, register, logout, completeProfile } from '../controllers/auth/auth-controller.ts';
import { authorizeUser } from '../middleware/authorize.user.ts';
import type RequestUser from '../types/RequestUser.ts';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)
router.post("/complete", authorizeUser, completeProfile)

router.get("/me", authorizeUser, (req: RequestUser, res: Response)=>{
    res.status(200).json({success: true, user: req.user})
})

export default router;