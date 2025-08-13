import { useParams } from 'react-router'
import { useEffect, useState } from 'react';
import useAuthentication from '../hooks/useAuthentication.ts';
import axios from '../lib/axios.ts';
import toast from 'react-hot-toast';
import ChatLoader from '../components/chatloader.tsx';

import * as StreamChat from 'stream-chat'
import { Chat, Channel, Window, ChannelHeader, MessageList, MessageInput } from 'stream-chat-react'

export default function ChatPage(){
    const { id } = useParams();

    const [ chatClient, setChatClient ] = useState<StreamChat.StreamChat | null>(null);
    const [ chatChannel, setChatChannel ] = useState<StreamChat.Channel | null>(null);
    const [ loading, setLoading ] = useState<boolean>(true)
    const { user } = useAuthentication();

    const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

    useEffect(() => {
        const initChat = async () => {
            const response = await axios.get("/chat/token");

            if (!response.data.token || !user) return;

            try {
                const client = StreamChat.StreamChat.getInstance(STREAM_API_KEY);

                await client.connectUser({
                    id: user.id.toString(),
                    name: `${user.first_name} ${user.last_name}`,
                    image: user.profile_picture
                }, response.data.token)

                const channelId = [user.id.toString(), id].sort().join("-");

                const currentChannel = client.channel("messaging", channelId,{
                    members: [user.id.toString(), id as string]
                });

                await currentChannel.watch();
                setChatClient(client)
                setChatChannel(currentChannel)
            } catch (error) {
                console.log("Error initializing chat:", error);
                toast.error("Could not connect to chat. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        
        if (user) {
            initChat();
        }
    }, [user, id])

    if (loading || !chatClient || !chatChannel) return <ChatLoader/>;

    return (
        <div className='h-[93vh]'>
            <Chat client={chatClient}>
                <Channel channel={chatChannel}>
                    <div className='w-full relative'>
                        <Window>
                            <ChannelHeader/>
                            <MessageList/>
                            <MessageInput focus/>
                        </Window>
                    </div>
                </Channel>
            </Chat>
        </div>
    )
}