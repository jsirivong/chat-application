import express from 'express';
import { authorizeUser } from '../middleware/authorize.user.ts';
import { getStreamToken } from '../controllers/chat-controller.ts'

const router = express.Router();

router.get("/token", authorizeUser, getStreamToken)

export default router;