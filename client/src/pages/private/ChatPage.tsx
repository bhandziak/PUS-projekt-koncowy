import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RoomItem from '../../features/room/components/RoomItem';
import MessageItem from '../../features/chat/components/MessageItem';
import { ROUTES } from '../../app/router/routePaths';


// --- MOCK DATA ---
const MOCK_ROOMS = [
    { id: '1', name: 'general', description: 'Ogólna dyskusja o wszystkim i niczym' },
    { id: '2', name: 'cyber-tech', description: 'Dyskusja o technologiach cyberpunkowych' },
    { id: '3', name: 'neon-city', description: 'Omówienia dotyczące miasta neon' },
    { id: '4', name: 'outcasts-hub', description: 'Miejsce dla wygnańców i odrzuconych' },
];

const MOCK_MESSAGES = [
    { id: '1', author: 'System', content: 'Ustanawianie bezpiecznego połączenia...', timestamp: '10:00' },
    { id: '2', author: 'System', content: 'Połączenie zestawione. Witaj w Omega IRC.', timestamp: '10:00' },
    { id: '3', author: 'NetRunner77', content: 'Ktoś tu jest?', timestamp: '10:03' },
];

const ChatPage = () => {
    const [activeRoomId, setActiveRoomId] = useState<string>('1');

    const activeRoom = MOCK_ROOMS.find(r => r.id === activeRoomId);

    return (
        <div className="cyber-chat-container"> 
            <div className="cyber-chat-wrapper">
                
                <div className="cyber-rooms-sidebar">
                    <div className="cyber-rooms-header">
                        <h2 className="dark-auth-label !text-base mb-4 tracking-wider">LISTA POKOI</h2>
                        <Link to={ROUTES.CREATE_ROOM} className="dark-auth-btn-primary gap-2"> 
                            <span className="text-lg leading-none">+</span> Dodaj pokój
                        </Link>
                    </div>
                    
                    <div className="cyber-rooms-list cyber-scrollbar">
                        {MOCK_ROOMS.map(room => (
                            <RoomItem 
                                key={room.id}
                                id={room.id}
                                name={room.name}
                                description={room.description}
                                isActive={activeRoomId === room.id}
                                onClick={setActiveRoomId}
                            />
                        ))}
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
                            
                            <span className="dark-status-success mt-1">Połączono</span>
                        </div>
                        
                        <div className="cyber-chat-header-actions">
                            <button className="dark-auth-btn-secondary !py-2 !w-auto text-xs uppercase tracking-wider">
                                Opuść pokój
                            </button>
                            <button className="dark-auth-btn-secondary !py-2 !w-auto text-xs uppercase tracking-wider !border-red-900/50 !text-red-400 hover:!bg-red-950/30 hover:!text-red-300 hover:!border-red-800">
                                Usuń pokój
                            </button>
                        </div>
                    </div>

                    <div className="cyber-chat-body cyber-scrollbar">
                        {MOCK_MESSAGES.map(msg => (
                            <MessageItem 
                                key={msg.id}
                                author={msg.author}
                                timestamp={msg.timestamp}
                                content={msg.content}
                            />
                        ))}
                    </div>

                    <div className="cyber-chat-footer">
                        <form className="cyber-chat-form" onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="text" 
                                placeholder="Wprowadź polecenie lub wiadomość..." 
                                className="dark-auth-input flex-1 !font-mono text-sm placeholder:text-zinc-700 focus:!border-sky-500/50"
                            />
                            <button type="submit" className="dark-auth-btn-primary !w-auto px-8 uppercase tracking-widest text-xs">
                                Wyślij
                            </button>
                        </form>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default ChatPage;