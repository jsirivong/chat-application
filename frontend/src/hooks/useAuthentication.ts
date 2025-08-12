import { useState, useEffect } from "react";
import axios from "../lib/axios.ts";
import useRegister from "./useRegister";
import type User from "../types/User.ts";

export default function useAuthentication() {
    const { loading } = useRegister();
    const [user, setUser] = useState<null | User>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(false);

    useEffect(() => {
        setAuthLoading(true);

        const findAuthentication = async () => {
            try {
                // axios automatically parses the json (no response.json() compared to fetch API)
                const response = await axios.get("/auth/me");

                setUser(response.data.user);
            } catch (err) {

            } finally {
                setAuthLoading(false);
            }
        };

        findAuthentication();
    }, [loading])

    return { authLoading, user }
}