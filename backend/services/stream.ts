import { StreamChat, type UserResponse } from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.STREAM_API_KEY;
const API_SECRET = process.env.STREAM_API_SECRET;

if (!API_KEY || !API_SECRET){
    throw new Error("Stream API key or secret is missing");
}

const streamClient = StreamChat.getInstance(API_KEY, API_SECRET);

// creates/updates a new Stream user
// creates if the user does not exist, update if it does
export const upsertStreamUser = async (userData: UserResponse) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData
    } catch (err) {
        console.error("Error upserting Stream user.\n", err);
    }
};

export const generateStreamToken = (id: number): string | void => {
    try {
        // change id to string
        const userId = id.toString();

        return streamClient.createToken(userId);
    } catch (err) {
        return console.error("Error generating stream token for user.\n", err);
    }
};