import { useState } from "react"
import { MessageSquareText } from "lucide-react";
import { Link } from 'react-router'
import type FormData from '../types/FormData.ts'
import useRegister from "../hooks/useRegister.ts";

interface IProps {
    handleSubmit: (formData: FormData) => void;
    error: string | null;
    loading: boolean;
}

export default function Register({handleSubmit, error, loading}: IProps) {
    const [formData, setFormData] = useState<FormData>({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    })

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme="light">
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* REGISTER FORM - LEFT SIDE */}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col">
                    {/* LOGO */}
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <MessageSquareText size={40} />
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

                    {/* FORM */}
                    <div className="w-full">
                        <form onSubmit={(e)=>{
                            e.preventDefault();
                            handleSubmit(formData);
                        }}>
                            <div className="space-y-4 mb-5">
                                <div>
                                    <h2 className="text-2xl font-semibold">Create an account</h2>
                                    <p className="text-sm opacity-70">
                                        Mutualize and chat with people online.
                                    </p>
                                </div>
                            </div>

                            {/* INPUTS */}
                            <div className="space-y-3">
                                <div className="flex flex-col w-full">
                                    <label className="label">
                                        <span className="label-text">First Name</span>
                                    </label>
                                    <input type="text" placeholder="among" className="input input-bordered w-full" value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} required />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label">
                                        <span className="label-text">Last Name</span>
                                    </label>
                                    <input type="text" placeholder="us" className="input input-bordered w-full" value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} required />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label">
                                        <span className="label-text">Email</span>
                                    </label>
                                    <input type="text" placeholder="amongus67@gmail.com" className="input input-bordered w-full" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                                </div>

                                <div className="flex flex-col w-full">
                                    <label className="label">
                                        <span className="label-text">Password</span>
                                    </label>
                                    <input type="password" placeholder="amongus67" className="input input-bordered w-full" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                                    <p className="text-xs opacity-70 mt-1">
                                        Password must be at least 8 characters long.
                                    </p>
                                </div>

                                <button type="submit" className="btn btn-primary w-full">
                                    {loading ? (<>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    Loading
                                    </>) : 'Create Account'}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-sm">
                                        Already have an account?{" "}
                                        <Link to={"/login"} className="text-primary hover:underline">
                                            Login
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* REGISTER FORM - RIGHT SIDE */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        {/* Illustration */}
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src="/login.svg" alt="Girl logging in." className="w-full h-full" />
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Chat with people worldwide.</h2>
                            <p className="opacity-70">
                                Create friendships, chat 24/7, and study together
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}