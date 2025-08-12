import { useState } from 'react'
import { useNavigate } from 'react-router'
import axios from '../lib/axios.ts';
import type FormData from '../types/FormData.ts';

export default function useRegister() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);

    const handleRegister = async (formData: FormData) => {
        setLoading(true);
        try {
            const response = await axios.post("/auth/register", formData);

            if (response){
                setError(null);
                navigate("/");
            }
        } catch (err: any) {
            setError(err.response.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return { loading, setLoading, error, setError, handleRegister }
}