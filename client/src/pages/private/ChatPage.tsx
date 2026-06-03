import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RoomItem from '../../features/room/components/RoomItem';
import MessageItem from '../../features/chat/components/MessageItem';
import RoomStatus from '../../features/room/components/RoomStatus';

import { ROUTES } from '../../app/router/routePaths';
import { RoomContext } from '../../app/providers/RoomProvider';
import { AuthContext } from '../../app/providers/AuthProvider';
import { ChatContext } from '../../app/providers/ChatProvider';

import { useRoom } from '../../features/room/hooks/useRoom';
import { useRoomInteraction } from '../../features/room/hooks/useRoomInteraction';
import { useChat } from '../../features/chat/hooks/useChat';

const ChatPage = () => {
    // USER CONTEXT
    const authContext = useContext(AuthContext);
    const user_role = authContext?.user?.role || 'USER';

    // ROOM CONTEXT
    const roomContext = useContext(RoomContext);
    if (!roomContext) return null;
    const { rooms, setRooms } = roomContext;

    // CHAT CONTEXT
    const chatContext = useContext(ChatContext);
    if (!chatContext) return null;
    const { messages, clearMessages } = chatContext;

    // HOOKS
    const { deleteRoom, isLoading: isDeleting, error: deleteError } = useRoom();
    const { joinRoom, leaveRoom, isLoading: isInteracting, error: interactionError, isSuccess: isSuccessfulInteraction } = useRoomInteraction();
    const { sendMessage, isSending, sendError } = useChat();

    const [input, setInput] = useState('');

    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const activeRoom = rooms.find(r => r.room_id === activeRoomId);

    const handleDeleteRoom = async () => {
        if (!activeRoomId) return;

        const confirmed = window.confirm(`Czy na pewno chcesz bezpowrotnie usunąć węzeł #${activeRoom?.name}?`);
        if (!confirmed) return;

        const success = await deleteRoom({ room_id: activeRoomId });
        
        if (success) {
            if (activeRoomId === activeRoom?.room_id) {
                setActiveRoomId(null);
                clearMessages();
                setInput('');
            }
        }
    };

    const handleRoomClick = (id: string) => {
        if (id === activeRoomId) return;

        setActiveRoomId(id);
        joinRoom({ room_id: id });
        clearMessages();
        setInput('');
    }

    const handleLeaveRoom = () => {
        if (!activeRoomId) return;

        leaveRoom({ room_id: activeRoomId });
        setActiveRoomId(null);
        clearMessages();
        setInput('');
    };

    const handleSendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!activeRoomId) return;
        if (!input.trim()) return;

        const success = await sendMessage({
            room_id: activeRoomId,
            content: input.trim()
        });

        if (success) {
            setInput('');
        }
    }

    useEffect(() => {
        if (activeRoomId && !rooms.some(r => r.room_id === activeRoomId)) {
            setActiveRoomId(null);
            clearMessages();
            alert("Pokój został usunięty przez administratora.")
        }
    }, [rooms, activeRoomId, clearMessages]);


    return (
        <div className="cyber-chat-container"> 
            <div className="cyber-chat-wrapper">
                
                <div className="cyber-rooms-sidebar">
                    <div className="cyber-rooms-header">
                        <h2 className="dark-auth-label !text-base mb-4 tracking-wider">LISTA POKOI</h2>
                        {
                            user_role === 'ADMIN' && (
                                <Link to={ROUTES.CREATE_ROOM} className="dark-auth-btn-primary gap-2"> 
                                    <span className="text-lg leading-none">+</span> Dodaj pokój
                                </Link>
                            )
                        }
                    </div>
                    
                    <div className="cyber-rooms-list cyber-scrollbar">
                    {rooms.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-800/60 rounded-lg bg-zinc-950/20 text-center my-2">
                            <span className="text-zinc-600 font-mono text-xs tracking-wider uppercase mb-1">
                                [ Brak dostępnych pokoi ]
                            </span>
                        </div>
                    ) : (
                        rooms.map(room => (
                            <RoomItem 
                                key={room.room_id}
                                id={room.room_id}
                                name={room.name}
                                description={room.description}
                                isActive={activeRoomId === room.room_id}
                                onClick={handleRoomClick}
                            />
                        ))
                    )}
                    </div>
                </div>

                <div className="cyber-chat-main">
                    
                    <div className="cyber-chat-header">
                        <div className="cyber-chat-title-wrapper !items-start"> 
                            
                            <div className="flex flex-col gap-0.5">
                                <h2 className="cyber-chat-title">
                                    <span className="text-sky-500">#</span> 
                                    {activeRoom?.name || 'Wybierz pokój'}
                                </h2>
                                
                                {activeRoom?.description && (
                                    <span className="cyber-chat-description" title={activeRoom.description}>
                                        // {activeRoom.description}
                                    </span>
                                )}
                            </div>
                            
                            <RoomStatus 
                                activeRoomId={activeRoomId}
                                isInteracting={isInteracting || isDeleting}
                                interactionError={interactionError || deleteError}
                            />
                        </div>
                        
                        {
                            activeRoomId && (
                                <div className="cyber-chat-header-actions">
                                    <button 
                                    className="dark-auth-btn-secondary !py-2 !w-auto text-xs uppercase tracking-wider"
                                    onClick={handleLeaveRoom}>
                                        Opuść pokój
                                    </button>
                                    {user_role === 'ADMIN' && (
                                        <button className="dark-auth-btn-secondary !py-2 !w-auto text-xs uppercase tracking-wider !border-red-900/50 !text-red-400 hover:!bg-red-950/30 hover:!text-red-300 hover:!border-red-800"
                                        onClick={handleDeleteRoom}>
                                            Usuń pokój
                                        </button>
                                    )}
                                </div>
                            )
                        }

                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 cyber-scrollbar">
                        {messages.map(msg => (
                            <MessageItem 
                                key={msg.message_id}
                                author={msg.author}
                                timestamp={new Date(msg.timestamp * 1000).toLocaleTimeString()}
                                content={msg.content}
                                isOwnMessage={authContext?.user?.username === msg.author}
                            />
                        ))}
                    </div>

                    <div className="cyber-chat-footer">
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800">
                        {sendError && (
                            <div className="text-red-500 text-xs mb-2">[ERR] {sendError}</div>
                        )}
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                disabled={isSending || !activeRoomId}
                                className="dark-auth-input flex-1"
                                placeholder="Napisz wiadomość..."
                            />
                            <button 
                                type="submit" 
                                disabled={isSending || !activeRoomId}
                                className="dark-auth-btn-primary !w-auto !px-6"
                            >
                                {isSending ? 'Wysyłanie...' : 'Wyślij'}
                            </button>
                        </div>
                    </form>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ChatPage;