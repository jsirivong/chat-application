import { useState } from "react";
import axios from "../lib/axios.ts";

interface FriendRequestData {
    readonly id: number;
    first_name: string;
    last_name: string;
    profile_picture: string;
    native_language: string | null;
}

export function useNotifications() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [incomingRequests, setIncomingRequests] = useState<Array<FriendRequestData>>([]);
    const [sentRequests, setSentRequests] = useState<Array<FriendRequestData>>([]);

    const acceptFriendRequest = async (id: number) => {
        setLoading(true);

        try {
            await axios.put(`/users/friend-request/${id}/accept`)
            setError(null)
        } catch (err: any) {
            setError(err.response.data?.message);
        } finally {
            setLoading(false);
        }
    }

    const getFriendRequests = async () => {
        setLoading(true);

        try {
            const response = await axios.get("/users/friend-requests")

            if (response.data && response.data.success) {
                setIncomingRequests(response.data.data?.incoming);
                setSentRequests(response.data.data?.sent);
            }

            setError(null)
        } catch (err: any) {
            if (err.response){
                setError(err.response.data?.message);
            }
            setError(err)
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, incomingRequests, sentRequests, acceptFriendRequest, getFriendRequests }
}