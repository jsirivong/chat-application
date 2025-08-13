import { useState, type FormEvent, useEffect } from "react";
import useAuthentication from "../hooks/useAuthentication.ts"
import type CompleteFormData from "../types/CompleteFormData.ts";
import { CameraIcon, MapPinIcon } from "lucide-react";
import { Languages } from "../types/Language.ts";
import axios from "../lib/axios.ts";
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'

export default function CompleteProfile() {
    const navigate = useNavigate();
    const { user } = useAuthentication();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [completeFormData, setCompleteFormData] = useState<CompleteFormData>({
        first_name: user?.first_name || "",
        last_name: user?.last_name || "",
        bio: user?.bio || "",
        native_language: user?.native_language || "",
        location: user?.location || "",
        profile_picture: user?.profile_picture || ""
    });

    useEffect(() => {
        if (user) {
            setCompleteFormData({
                first_name: user.first_name ?? "",
                last_name: user.last_name ?? "",
                bio: user.bio ?? "",
                native_language: user.native_language ?? "",
                location: user.location ?? "",
                profile_picture: user.profile_picture ?? ""
            });
        }
    }, [user]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post("/auth/complete", completeFormData)

            setError(null);
            toast.success("Completed Profile")
        } catch (err: any) {
            setError(err.response.data?.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4" data-theme='light'>
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body p-6 sm:p-8">
                    <h1 className="text-2xl sm:test-3xl font-bold text-center mb-6">Complete Your Profile</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ERROR MESSAGE */}
                        {error && (
                            <div className="alert alert-error mb-4">
                                <span className="font-semibold">{error}</span>
                            </div>
                        )}

                        {/* Profile Picture */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            {completeFormData?.profile_picture ? (
                                <img src={completeFormData?.profile_picture} alt="Profile Preview" className="size-30 object-cover rounded-full" />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <CameraIcon className="size-12 text-base-content opacity-40" />
                                </div>
                            )}
                        </div>

                        {/* FIRST NAME */}
                        <div className="flex flex-col w-full">
                            <label className="label">
                                <span className="label-text">First Name</span>
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={completeFormData.first_name}
                                onChange={(e) => setCompleteFormData({ ...completeFormData, first_name: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="First name"
                            />
                        </div>

                        {/* LAST NAME */}
                        <div className="flex flex-col w-full">
                            <label className="label">
                                <span className="label-text">Last Name</span>
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={completeFormData.last_name}
                                onChange={(e) => setCompleteFormData({ ...completeFormData, last_name: e.target.value })}
                                className="input input-bordered w-full"
                                placeholder="Last name"
                            />
                        </div>

                        {/* BIO */}
                        <div className="flex flex-col w-full">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>
                            <textarea
                                name="bio"
                                value={completeFormData.bio}
                                onChange={(e) => setCompleteFormData({ ...completeFormData, bio: e.target.value })}
                                className="textarea textarea-bordered h-24 w-full"
                                placeholder="Tell others about yourself"
                            />
                        </div>

                        {/* NATIVE LANGUAGE */}
                        <div className="flex flex-col">
                            <label className="label">
                                <span className="label-text">Native Language</span>
                            </label>
                            <select name="native_language" value={completeFormData.native_language} onChange={(e) => setCompleteFormData({ ...completeFormData, native_language: e.target.value })} className="select select-bordered w-full">
                                <option value={""}>
                                    Select your native language
                                </option>
                                {Languages.map((lang) => (
                                    <option key={`native-${lang}`} value={lang}>
                                        {lang}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* LOCATION */}
                        <div className="flex flex-col w-full">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <div className="relative">
                                <MapPinIcon color={"black"} className="absolute text-black top-1/2 transform -translate-y-1/2 left-3 size-5 opacity-70" />
                                <input type="text" name="location" value={completeFormData.location} onChange={(e) => setCompleteFormData({ ...completeFormData, location: e.target.value })} className="input input-bordered w-full pl-10" placeholder="City, Country" />
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button className="btn btn-primary w-full" disabled={loading} type="submit">
                            {loading ? (
                                <span className="loading loading-spinner loading-sm">
                                    <>Loading</>
                                </span>
                            ) : ('Complete Profile')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}