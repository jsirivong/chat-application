import { useState, useEffect } from "react";
import axios from "../lib/axios.ts";
import type User from "../types/User.ts";

export default function useAuthentication() {
    const [user, setUser] = useState<null | User>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(false);

    useEffect(() => {
        setAuthLoading(true);

        const findAuthentication = async () => {
            try {
                // axios automatically parses the json (no response.json() compared to fetch API)
                const response = await axios.get("/auth/me");

                if (response.data.user){
                    setUser(response.data.user);
                }
            } catch (err) {
                return null;
            } finally {
                setAuthLoading(false);
            }
        };

        findAuthentication();
    }, [])

    return { authLoading, user }
}