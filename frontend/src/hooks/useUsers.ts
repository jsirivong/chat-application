import { useState } from "react";
import axios from "../lib/axios.ts";
import type User from "../types/User.ts";
import type FriendRequest from "../types/FriendRequest.ts";

export default function useUsers(){
    const [ loading, setLoading ] = useState<boolean>(false)
    const [ error, setError ] = useState<null | string>(null);
    const [ outgoingRequestsIds, setOutgoingRequestsIds ] = useState<Set<number>>(new Set()); 
    const [ friends, setFriends ] = useState<User[]>([]);
    const [ recommendedUsers, setRecommendedUsers ] = useState<User[]>([]);

    const getFriends = async () => {    
        setLoading(true);

        try {
            const response = await axios.get("/users/friends")

            console.log(response.data)
            setFriends(response.data.data)
            setError(null)
        } catch (err: any){
            setError(err.response.data?.message);
        } finally {
            setLoading(false)
        }
    }

    const getRecommendedUsers = async () => {
        setLoading(true);

        try {
            const response = await axios.get("/users")

            setRecommendedUsers(response.data.data)
            
            setError(null)
        } catch (err: any){
            setError(err.response.data?.message);
        } finally {
            setLoading(false)
        }
    }

    const getOutgoingRequests = async () => {
        setLoading(true);

        try {
            const response = await axios.get("/users/outgoing-friend-requests")

            const requestsIds = new Set<number>();

            response.data.data.map((val: FriendRequest) => {
                requestsIds.add(val.recipient);
            })

            setOutgoingRequestsIds(requestsIds);
            setError(null)
        } catch (err: any){
            setError(err.response.data?.message);
        } finally {
            setLoading(false)
        }
    }

    const sendFriendRequest = async (id: number) => {
        setLoading(true);

        try {
            const response = await axios.post(`/users/friend-request/${id}`)

            if (response.data.data?.status === "pending"){
                setOutgoingRequestsIds((prev) => prev.add(response.data.data?.recipient));
            }
        } catch (err: any){
            setError(err.response.data?.message);
        } finally {
            setLoading(false)
        }
    }

    return { loading, error, outgoingRequestsIds, friends, recommendedUsers, getFriends, getRecommendedUsers, getOutgoingRequests, sendFriendRequest}
}