export default interface FriendRequest {
    sender: number;
    recipient: number;
    status: "pending" | "accepted";
    created_at: Date;
}