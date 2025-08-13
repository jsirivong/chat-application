import { type Request, type Response } from 'express'
import type RequestUser from '../types/RequestUser.ts';
import { sql } from '../services/database.ts';
import type User from '../types/User.ts';
import type FriendRequest from '../types/FriendRequest.ts';

interface FriendRequestData {
    readonly id: number;
    first_name: string;
    last_name: string;
    profile_picture: string;
    native_language: string;
}

export const getRecommendedUsers = async (req: RequestUser, res: Response) => {
    try {
        const id = req.user?.id;
        const user = req.user;

        let recommendedUsers: User[] = [];

        if (user?.friends) {
            const users = await sql`SELECT * FROM Users WHERE NOT id=${id} AND completed_profile=true` as User[];
            recommendedUsers = users.filter((val) => !user.friends.find((friend) => friend == val.id))
        } else {
            recommendedUsers = await sql`SELECT * FROM Users WHERE NOT id=${id} AND completed_profile=true` as User[];
        }

        res.status(200).json({ success: true, data: recommendedUsers });
    } catch (err) {
        console.log("Error fetching recommended users.\n", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const getFriends = async (req: RequestUser, res: Response) => {
    try {
        if (!req.user?.friends) return res.status(400).json({ success: false, message: "User does not have friends." })

        const users = await sql`SELECT id, first_name, last_name, native_language, profile_picture, bio FROM Users` as FriendRequestData[];
       
        const friends = users.filter((val) => req.user?.friends.includes(val.id))

        res.status(200).json({ success: true, data: friends });
    } catch (err) {
        console.log("Error in getFriends controller.\n", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const sendFriendRequest = async (req: RequestUser, res: Response) => {
    try {
        const senderId = req.user?.id; // the id of the authenticated user with json web token
        const recipientId = req.params.id;

        // prevent sending request to yourself
        if (senderId === Number(recipientId)) {
            return res.status(400).json({ success: false, message: "Users cannot send a friend requests to themselves." });
        }

        const recipient: User[] = await sql`SELECT * FROM Users WHERE id=${recipientId}` as User[];

        if (!recipient) {
            return res.status(404).json({ success: false, message: "Recipient does not exist." });
        }

        if (recipient[0].friends.includes(senderId as number)) {
            return res.status(400).json({ success: false, message: "Sender is already friends with the recipient." });
        }

        // check if a friend request already exists
        const existingFriendRequest: FriendRequest[] = await sql`SELECT * FROM friendrequests WHERE (sender=${senderId} AND recipient=${recipientId}) OR (sender=${recipientId} AND recipient=${senderId});` as FriendRequest[];

        if (existingFriendRequest[0]) return res.status(400).json({ success: false, message: "Friend request already exists between sender and recipient." });

        const friendRequest: FriendRequest = (await sql`INSERT INTO friendrequests (sender, recipient) VALUES (${senderId}, ${recipientId}) RETURNING *;` as FriendRequest[])[0];

        res.status(201).json({ success: true, data: friendRequest });
    } catch (err) {
        console.log("Error in sendFriendRequest controller.\n", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const acceptFriendRequest = async (req: RequestUser, res: Response) => {
    try {
        const recipientId = req.params.id;
        const accepter = req.user?.id;

        if (!recipientId) {
            return res.status(400).json({ success: false, message: "Recipient does not exist." });
        }

        const [existingFriendRequest] = await sql`SELECT * FROM friendrequests WHERE sender=${recipientId} AND recipient=${accepter} AND status='pending';` as FriendRequest[];

        if (!existingFriendRequest) {
            return res.status(404).json({ success: false, message: "Friend request does not exist." });
        };

        await sql`UPDATE friendrequests SET status='accepted' WHERE sender=${recipientId} AND recipient=${accepter};`;
        await sql`UPDATE Users SET friends=ARRAY_APPEND(friends, ${recipientId}) WHERE id=${accepter}`;
        await sql`UPDATE Users SET friends=ARRAY_APPEND(friends, ${accepter}) WHERE id=${recipientId}`;

        res.status(200).json({ success: true, message: "Friend request accepted." })
    } catch (err) {
        console.log("Error in acceptFriendRequest controller.\n", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const getFriendRequests = async (req: RequestUser, res: Response) => {
    try {
        const id = req.user?.id;

        const incomingFriendRequests = await sql`SELECT sender FROM friendrequests WHERE recipient=${id} AND status='pending';`;
        const sentFriendRequests = await sql`SELECT recipient FROM friendrequests WHERE sender=${id} ORDER BY status='accepted' DESC;`;

        const incomingFriendRequestProfiles = await Promise.all(
            incomingFriendRequests.map(async (req) => {
                const [profile] = await sql`SELECT id, first_name, last_name, profile_picture, native_language FROM Users WHERE id=${req.sender}` as FriendRequestData[];
                return profile;
            })
        );

        const sentFriendRequestProfiles = await Promise.all(
            sentFriendRequests.map(async (req) => {
                const [profile] = await sql`SELECT id, first_name, last_name, profile_picture, native_language FROM Users WHERE id=${req.recipient}` as FriendRequestData[];
                return profile;
            })
        );

        res.status(200).json({
            success: true, data: {
                incoming: incomingFriendRequestProfiles,
                sent: sentFriendRequestProfiles
            }
        });
    } catch (err) {
        console.log("Error in getFriendRequests controller.\n", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const getOutgoingFriendRequests = async (req: RequestUser, res: Response) => {
    try {
        const outgoingRequests = await sql`SELECT * FROM friendrequests WHERE sender=${req.user?.id} AND status='pending'` as FriendRequest[];

        res.status(200).json({ success: true, data: outgoingRequests });
    } catch (err) {
        console.log("Error in getOutgoingFriendRequests controller.\n", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
}