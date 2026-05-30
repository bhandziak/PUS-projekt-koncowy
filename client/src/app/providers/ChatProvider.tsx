import React, { createContext, useState, useEffect, useCallback } from 'react';
import { subscribeToBroadcast } from '../../api/websocket/client';
import type { ChatMessage } from '../../features/chat/dto/ChatMessage';
import APIs from '../../api/ApiURL';

export interface ChatContextType {
    messages: ChatMessage[];
    clearMessages: () => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    // clear messages when user changes room
    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);


    // TODO - test it
    useEffect(() => {
        const unsubscribe = subscribeToBroadcast(APIs.ON_NEW_MESSAGE.type, (eventData) => {
            const { payload } = eventData;
            
            if (payload?.action === APIs.ON_NEW_MESSAGE.action) {
                const incomingMessage = payload.data as ChatMessage;

                setMessages(prev => {
                    // if message already exists in the list, skip it
                    if (prev.some(m => m.message_id === incomingMessage.message_id)) {
                        return prev;
                    }
                    
                    // add new message
                    return [...prev, incomingMessage];
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <ChatContext.Provider value={{ messages, clearMessages }}>
            {children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;