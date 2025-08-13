import { useState } from "react";
import toast from 'react-hot-toast'
import axios from "../lib/axios.ts";
import { useNavigate } from 'react-router'

export default function useLogout() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);

    const handleLogout = async () => {
        try {
            setLoading(true);

            await axios.post("/auth/logout");
            setError(null);
            toast.success("Successfully logged out");
        } catch (err: any) {
            setError(err.response.data?.message);
            toast.error(error);
        } finally {
            setLoading(false);
        }
    }

    return { loading, error, handleLogout }
}