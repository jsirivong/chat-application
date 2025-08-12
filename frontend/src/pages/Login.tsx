import { MessageSquareText } from "lucide-react";
import axios from "../lib/axios.ts"
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from 'react-router';

interface LoginData {
    [key: string]: string;
    email: string;
    password: string;
}

export default function Login() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: ""
    })

    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post("/auth/login", loginData);

            if (response.status === 200) {
                navigate("/");
            } else {
                return
            }
        } catch (err: any) {
            setError(err.response.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="light">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* LOGIN FORM SECTION */}
                <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8">
                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <MessageSquareText size={40}/>
                        <span className="text-3xl font-bold font-mono bg-clip-text tracking-tight">
                            Chat
                        </span>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="alert alert-error mb-4">
                            <span className="font-semibold">{error}</span>
                        </div>
                    )}

                    <div className="w-full">
                        <form onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-4xl text-center font-semibold">Login</h2>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col space-y-2">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input 
                                            type="email"
                                            placeholder="amongus67@gmail.com"
                                            className="input input-bordered w-full"
                                            value={loginData.email}
                                            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col space-y-2">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input 
                                            type="password"
                                            placeholder="amongus67"
                                            className="input input-bordered w-full"
                                            value={loginData.password}
                                            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-full" disabled={loading || loginData.password.length < 8 || !loginData.email}>
                                    {loading ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            Loading
                                        </>
                                    ) : "Login"}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-sm">Don't have an account?</p>
                                    <Link to={"/register"} className="text-primary hover:underline text-sm">
                                        Create one                                    
                                    </Link>
                                </div>  
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}