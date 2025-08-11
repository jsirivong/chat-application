import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from '../lib/axios.ts';
import type FormData from '../types/FormData.ts';

export default function useRegister() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);

    setLoading(true);

    const handleRegister = async (formData: FormData) => {
        try {
            const response = await axios.post("/auth/register", formData);

            if (response.status !== 201) return console.log("Something went wrong.");

            setError(null);
            navigate("/");
        } catch (err) {
            setError("Error signing up.");
            console.log(error, err);
        } finally {
            setLoading(false);
        }
    }
    
    return { loading, setLoading, error, setError, handleRegister }
}