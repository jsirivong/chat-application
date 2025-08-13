import { Link } from "react-router";
import useUsers from "../hooks/useUsers"
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, Users2Icon } from "lucide-react";
import FriendCard, { getLanguageFlag } from "../components/friendcard";
import type User from "../types/User";
import { useEffect } from "react";

export default function Home() {
    const { loading, error, friends, recommendedUsers, outgoingRequestsIds, getRecommendedUsers, getFriends, getOutgoingRequests, sendFriendRequest } = useUsers();

    useEffect(() => {
        getRecommendedUsers();
        getFriends();
        getOutgoingRequests();

        console.log(friends)
    }, [])

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
                    <Link to={"/notifications"} className="btn btn-outline btn-sm">
                        <Users2Icon className="mr-2 size-4" />
                        Friend Requests
                    </Link>
                </div>

                {error && (
                    <div className="alert alert-error mb-4">
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : friends.length === 0 ? (
                    <div className="card bg-base-200 p-6 text-center">
                        <h3 className="font-semibold text-lg mb-2">No friends yet :{"("}</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {friends.map((friend) => (
                            <FriendCard key={friend.id} friend={friend} />
                        ))}
                    </div>
                )}

                <section>
                    <div className="mb-6 sm:mb-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Friends</h2>
                                <p className="opacity-70">
                                    Discover new friends to hang out and study with.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                ) : recommendedUsers.length === 0 ? (
                    <div className="card bg-base-200 p-6 text-center">
                        <h3 className="font-semibold text-lg mb-2">No recommendations available.</h3>
                        <p className="text-base-content opacity-70">
                            Check back later.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {recommendedUsers.map((user: User) => {
                            const requestAlreadySent: boolean = outgoingRequestsIds.has(user.id);

                            return (
                                <div key={user.id} className=" card bg-base-200 hover:shadow-lg transition:all duration-300">
                                    <div className="card-body p-5 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar size-16 rounded-full">
                                                <img src={user.profile_picture} alt={user.first_name + " " + user.last_name} />
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-lg">{user.first_name + " " + user.last_name}</h3>
                                                {user.location && (
                                                    <div className="flex items-center text-xs opacity-70 mt-1">
                                                        <MapPinIcon className="size-3 mr-1" />
                                                        {user.location}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* LANGUAGE */}
                                        <div className="flex flex-wrap gap-1.5">
                                            <span className="badge badge-secondary">
                                                {getLanguageFlag(user.native_language)}
                                                Native: {user.native_language}
                                            </span>
                                        </div>

                                        {/* BIO */}
                                        {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                                        {/* Add Button*/}
                                        <button className={`btn w-full mt-2 ${requestAlreadySent ? 'btn-disabled' : 'btn-primary'}`} onClick={() => sendFriendRequest(user.id)} disabled={requestAlreadySent || loading}>
                                            {requestAlreadySent ? (
                                                <>
                                                    <CheckCircleIcon className="size-4 mr-2" />
                                                    Request Sent
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlusIcon className="size-4 mr-2" />
                                                    Send Friend Request
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )
                }
            </div>
        </div>
    )
}