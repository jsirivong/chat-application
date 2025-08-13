import { HomeIcon, MessageSquareText, UsersIcon } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication";
import { useLocation, Link } from 'react-router';

export default function Sidebar(){
    const { user, authLoading } = useAuthentication();
    const location = useLocation();

    const currentPath = location.pathname;

    return (
        <aside className="w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0">
            <div className="p-5 border-b border-base-300">
                <Link to={"/"} className="flex items-center gap-2.5">
                    <MessageSquareText className="size-9  text-primary"/>
                    <span className="text-3xl font-bold font-mono bg-clip-text tracking-tighter">Chat</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <Link to={"/"} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" && 'btn-active'}`}>
                    <HomeIcon className="size-5 text-base-content opacity-70"/>
                    <span>Home</span>
                </Link>

                <Link to={"/friends"} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/friends" && 'btn-active'}`}>
                    <UsersIcon className="size-5 text-base-content opacity-70"/>
                    <span>Friends</span>
                </Link>

                <Link to={"/notifications"} className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/notifications" && 'btn-active'}`}>
                    <UsersIcon className="size-5 text-base-content opacity-70"/>
                    <span>Notifications</span>
                </Link>
            </nav>

            {/* USER PROFILE */}
            <div className="p-4 border-5 border-base-300 mt-auto"> {/* "mt-auto" makes it so the div is at the bottom of the sidebar*/}
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            {authLoading ? <span className="text-xs">Loading</span> : <img src={user?.profile_picture} alt="User Avatar"/>}
                        </div>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm">{authLoading ? "Loading" : `${user?.first_name + " " + user?.last_name}`}</p>
                        <p className="text-xs text-success flex items-center gap-1">
                            <span className="size-2 rounded-full bg-success"></span>
                            Online
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}