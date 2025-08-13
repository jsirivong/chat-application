import { BellIcon, LogOutIcon, MessageSquareText } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication.ts"
import { useLocation, Link } from 'react-router';
import ThemeSelector from "./themeselector.tsx";
import useLogout from "../hooks/useLogout.ts";

export default function Navbar() {
    const { loading, error, handleLogout } = useLogout();
    const { user, authLoading } = useAuthentication();
    const location = useLocation();

    const onChatPage = location.pathname?.startsWith("/chat");

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full gap-2.5"> {/* justify-end pushes the content to the end (all the way to the right) */}
                    {/* LOGO - ONLY IN THE CHAT PAGE */}
                    {onChatPage && (
                        <Link to={"/"} className="flex items-center gap-2.5">
                            <div className="pl-5">
                                <MessageSquareText className="size-9 text-primary" />
                                <span className="text-3xl font-bold font-mono bg-clip-text tracking-tighter">
                                    Chat
                                </span>
                            </div>
                        </Link>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link to={"/notifications"}>
                            <button className="btn btn-ghost btn-circle">
                                <BellIcon className="h-6 w-6 text-base-content opacity-70" />
                            </button>
                        </Link>
                    </div>

                    <ThemeSelector />

                    <div className="avatar">
                        <div className="w-9 rounded-full">
                            {authLoading ? <span className="text-xs">Loading</span> : <img src={user?.profile_picture} alt="User Avatar" rel="noreferrer" />}
                        </div>
                    </div>

                    <button className="btn btn-ghost btn-circle" onClick={handleLogout}>
                        <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
                    </button>
                </div>
            </div>
        </nav>
    )
}