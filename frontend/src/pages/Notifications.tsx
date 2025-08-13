import { useEffect } from "react";
import { useNotifications } from "../hooks/useNotifications.ts"
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheck } from "lucide-react";
import useAuthentication from "../hooks/useAuthentication.ts";
import NoNotifications from "../components/nonotifications.tsx";

export default function Notifications() {
    const { loading, error, incomingRequests, sentRequests, getFriendRequests, acceptFriendRequest } = useNotifications();
    const { user } = useAuthentication();

    useEffect(() => {
        getFriendRequests();
    }, [])

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto w-full space-y-8">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="alert alert-error mb-4">
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : (
                    <>  {/* <-- a fragment */}
                        {incomingRequests.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <UserCheck className="h-5 w-5 text-primary" />
                                    Friend Requests
                                    <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                                </h2>

                                <div className="space-y-3">
                                    {incomingRequests.map((req) => (
                                        <div key={req.id} className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="card-body p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="avatar size-14 rounded-full bg-base-300">
                                                            <img src={req.profile_picture} alt={req.first_name + " " + req.last_name}/>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold">{req.first_name + " " + req.last_name}</h3>
                                                            <div className="flex flex-wrap gap-1.5 mt-1">
                                                                <span className="badge badge-secondary badge-sm">
                                                                    Native: {req.native_language}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <button className="btn btn-primary btn-sm" disabled={loading} onClick={() => {
                                                acceptFriendRequest(req.id);
                                                getFriendRequests();
                                            }}>Accept</button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* ACCEPTED REQS NOTIFICATIONS */}
                        {sentRequests.length > 0 && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <BellIcon className="size-5 text-success"/>
                                    New
                                </h2>

                                <div className="space-y-3">
                                    {sentRequests.map((notification) => (
                                        (
                                        <div key={notification.id}>
                                            <div className="card-body p-4">
                                                <div className="avatar mt-1 size-10 rounded-full">
                                                    <img src={notification.profile_picture} alt={notification.first_name + " " + notification.last_name}/>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{`${notification.first_name} ${notification.last_name}`}</h3>
                                                    <p className="text-sm my-1">
                                                        {user?.friends.includes(notification.id) ? `${notification.first_name} ${notification.last_name} accepted your friend request.` : "Sent friend request"}
                                                    </p>
                                                    <p className="text-xs flex tems-center opacity-70">
                                                        <ClockIcon className="size-3 mr-1"/>
                                                        Recently
                                                    </p>
                                                </div>
                                                {user?.friends.includes(notification.id) && 
                                                <div className="badge badge-success">
                                                    <MessageSquareIcon className="size-3 mr-1"/>
                                                    New Friend
                                                </div>}
                                            </div>
                                        </div>
                                    )
                                    ))}
                                </div>
                            </section>
                        )}

                        {incomingRequests.length === 0 && sentRequests.length === 0 && (
                            <NoNotifications/>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}