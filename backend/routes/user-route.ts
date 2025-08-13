import express from 'express';
import { getRecommendedUsers, getFriends, sendFriendRequest, acceptFriendRequest, getFriendRequests, getOutgoingFriendRequests } from '../controllers/user-controller.ts'
import { authorizeUser } from '../middleware/authorize.user.ts'
 
const router = express.Router();

// apply auth middleware to all requests/routes
router.use(authorizeUser)

router.post("/friend-request/:id", sendFriendRequest)
router.put("/friend-request/:id/accept", acceptFriendRequest);
router.get("/", getRecommendedUsers)
router.get("/friends", getFriends)
router.get("/friend-requests", getFriendRequests)
router.get("/outgoing-friend-requests", getOutgoingFriendRequests)

export default router; 
